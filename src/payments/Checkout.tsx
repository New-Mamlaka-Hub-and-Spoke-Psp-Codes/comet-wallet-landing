import { useCallback, useEffect, useRef, useState, type ButtonHTMLAttributes, type FormEvent, type ReactNode } from 'react';
import { fetchLink, errorMessage, sendReceipt, startMpesa } from './api';
import { formatAmount, isValidEmail, normalizeKenyanPhone, type PaymentLink } from './paymentLink';

const POLL_MS = 3_000;
// M-Pesa drops an unanswered STK prompt after about a minute; give the
// callback some slack before telling the payer it may not have gone through.
const WAIT_LIMIT_MS = 120_000;
const APP_STORE_URL = 'https://apps.apple.com/app/id6791149629';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.cometswitch.kenya';

type Method = 'mpesa' | 'wallet';

type Stage =
  | { kind: 'pay'; error?: string }
  | { kind: 'sending' }
  | { kind: 'waiting'; since: number }
  | { kind: 'stalled' }
  | { kind: 'paid' };

export default function Checkout({
  code,
  initialLink,
  initialError,
  walletQR,
}: {
  code: string;
  initialLink: PaymentLink | null;
  initialError: string | null;
  /** SVG markup of the QR to scan with Comet Wallet; null hides the wallet option. */
  walletQR: string | null;
}) {
  const [link, setLink] = useState(initialLink);
  const [stage, setStage] = useState<Stage>(() => (initialLink?.paid ? { kind: 'paid' } : { kind: 'pay' }));
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<Method>('mpesa');

  const refresh = useCallback(async () => {
    const { link: latest } = await fetchLink(code);
    if (latest) setLink(latest);
    return latest;
  }, [code]);

  // While the payer approves the prompt, poll until the callback lands.
  const waitingSince = stage.kind === 'waiting' ? stage.since : null;
  useEffect(() => {
    if (waitingSince === null) return;
    const timer = setInterval(async () => {
      const latest = await refresh();
      if (latest?.paid) setStage({ kind: 'paid' });
      else if (latest?.transactionStatus === 'failed') setStage({ kind: 'pay', error: "The payment was cancelled or didn't go through. You can try again." });
      else if (Date.now() - waitingSince > WAIT_LIMIT_MS) setStage({ kind: 'stalled' });
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [waitingSince, refresh]);

  // While the payer is paying in the app, watch for the link turning paid.
  const watchingWallet = (method === 'wallet' || link?.currency !== 'KES') && Boolean(walletQR) && stage.kind === 'pay';
  useEffect(() => {
    if (!watchingWallet) return;
    const timer = setInterval(async () => {
      if (document.hidden) return;
      const latest = await refresh();
      if (latest?.paid) setStage({ kind: 'paid' });
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [watchingWallet, refresh]);

  async function pay(e: FormEvent) {
    e.preventDefault();
    const normalized = normalizeKenyanPhone(phone);
    if (!normalized) {
      setStage({ kind: 'pay', error: 'Enter a valid M-Pesa number, e.g. 0712 345 678' });
      return;
    }
    setStage({ kind: 'sending' });
    const result = await startMpesa(code, normalized);
    if (result.ok) return setStage({ kind: 'waiting', since: Date.now() });
    // The link may have changed under us (paid elsewhere, expired); show its real state.
    const latest = await refresh();
    if (latest?.paid) return setStage({ kind: 'paid' });
    setStage({ kind: 'pay', error: errorMessage(result, "We couldn't start the M-Pesa payment. Please try again.") });
  }

  async function checkAgain() {
    const latest = await refresh();
    setStage(latest?.paid ? { kind: 'paid' } : { kind: 'pay', error: "We haven't received this payment yet. If M-Pesa took the money, it will show here shortly." });
  }

  if (!link) {
    return (
      <CheckoutShell>
        <Notice
          tone="error"
          title="Payment link not found"
          body={initialError && initialError !== 'Payment link not found' ? initialError : 'Check the link you were sent, or ask the merchant for a new one.'}
        />
      </CheckoutShell>
    );
  }

  let body: ReactNode;
  if (stage.kind === 'paid') body = <Paid code={code} link={link} />;
  else if (link.expired) body = <Notice tone="warning" title="This link has expired" body="Ask the merchant to send you a new payment link." />;
  else if (link.currency !== 'KES' && !walletQR)
    body = (
      <Notice
        tone="warning"
        title="M-Pesa isn't available for this link"
        body={`This link asks for ${link.currency}. M-Pesa checkout works for KES links only; ask the merchant for a KES link.`}
      />
    );
  else if (stage.kind === 'waiting') body = <Waiting link={link} phone={phone} />;
  else if (stage.kind === 'stalled') body = <Stalled onCheck={checkAgain} onRetry={() => setStage({ kind: 'pay' })} />;
  else
    body = (
      <div className="pay-actions">
        {walletQR && link.currency === 'KES' && <MethodPicker method={method} setMethod={setMethod} />}
        {method === 'wallet' || link.currency !== 'KES' ? (
          walletQR && <WalletPay code={code} qr={walletQR} />
        ) : (
          <PayForm link={link} phone={phone} setPhone={setPhone} onSubmit={pay} sending={stage.kind === 'sending'} error={stage.kind === 'pay' ? stage.error : undefined} />
        )}
      </div>
    );

  return (
    <CheckoutShell>
      <Amount link={link} paid={stage.kind === 'paid'} />
      {body}
    </CheckoutShell>
  );
}

// The checkout follows the Comet Wallet app's look (see payments.css), not
// the landing page's, so it renders without the site's nav and footer.
export function CheckoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="pay">
      <main className="pay-shell">
        <header className="pay-header">
          <div className="pay-brand">
            <img src="/comet-logo.png" alt="" width={32} height={32} />
            <span>Comet</span>
          </div>
          <span className="pay-secure">
            <LockIcon /> Secure checkout
          </span>
        </header>
        <div className="pay-body">{children}</div>
        <footer className="pay-footer">Powered by Comet Wallet</footer>
      </main>
    </div>
  );
}

function Amount({ link, paid }: { link: PaymentLink; paid: boolean }) {
  return (
    <section className="pay-amount">
      <p className="pay-amount-label">{paid ? 'Amount Paid' : 'Requested Amount'}</p>
      <p className="pay-amount-value">
        <span className="pay-currency">{link.currency} </span>
        <span className="pay-figure">{formatAmount(link.amount)}</span>
      </p>
      {link.description && <p className="pay-description">{link.description}</p>}
      <p className="pay-ref">Ref {link.shortCode}</p>
    </section>
  );
}

function PayForm(props: {
  link: PaymentLink;
  phone: string;
  setPhone: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  sending: boolean;
  error?: string;
}) {
  return (
    <form onSubmit={props.onSubmit} className="pay-form" noValidate>
      <label htmlFor="phone" className="pay-label">
        M-Pesa number
      </label>
      <div className="pay-field">
        <img src="/mpesa.png" alt="M-Pesa" width={28} height={28} />
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0712 345 678"
          value={props.phone}
          onChange={(e) => props.setPhone(e.target.value)}
          disabled={props.sending}
          aria-invalid={Boolean(props.error)}
          aria-describedby={props.error ? 'pay-error' : 'pay-hint'}
        />
      </div>
      {props.error ? (
        <p id="pay-error" role="alert" className="pay-error">
          {props.error}
        </p>
      ) : (
        <p id="pay-hint" className="pay-hint">
          You&apos;ll get a prompt on this phone to enter your M-Pesa PIN.
        </p>
      )}
      <PrimaryButton type="submit" disabled={props.sending} className="pay-gap-lg">
        {props.sending ? (
          <>
            <Spinner /> Sending prompt…
          </>
        ) : (
          `Pay ${props.link.currency} ${formatAmount(props.link.amount)}`
        )}
      </PrimaryButton>
    </form>
  );
}

function MethodPicker({ method, setMethod }: { method: Method; setMethod: (m: Method) => void }) {
  const options: { value: Method; label: string }[] = [
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'wallet', label: 'Comet Wallet' },
  ];
  return (
    <div role="radiogroup" aria-label="Payment method" className="pay-methods">
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={method === o.value} onClick={() => setMethod(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Paying from a Comet balance happens in the app, where the payer is signed
// in and confirms with their PIN. Phones get a button that opens the app on
// this link; larger screens get a QR to scan with it. This page notices the
// payment by polling.
function WalletPay({ code, qr }: { code: string; qr: string }) {
  return (
    <section className="pay-wallet" aria-live="polite">
      <p className="pay-text pay-center">Pay from your Comet balance. You&apos;ll confirm with your PIN in the app.</p>
      <div className="pay-qr">
        <div className="pay-qr-box" dangerouslySetInnerHTML={{ __html: qr }} />
        <p>Scan with Comet Wallet</p>
      </div>
      <a href={`cometwallet://pay/${encodeURIComponent(code)}`} className="pay-btn pay-btn-primary pay-open-app">
        <img src="/comet-logo.png" alt="" width={22} height={22} /> Open Comet Wallet
      </a>
      <p className="pay-hint pay-center pay-store">
        This page updates once you&apos;ve paid. No Comet Wallet yet? Get it on <a href={PLAY_STORE_URL}>Google Play</a> or the <a href={APP_STORE_URL}>App Store</a>.
      </p>
    </section>
  );
}

function Waiting({ link, phone }: { link: PaymentLink; phone: string }) {
  return (
    <section className="pay-status" aria-live="polite">
      <div className="pay-badge pay-badge-brand">
        <Spinner large />
      </div>
      <h1>Check your phone</h1>
      <p className="pay-text">
        Enter your M-Pesa PIN on {phone.trim()} to pay {link.currency} {formatAmount(link.amount)}. This page updates by itself.
      </p>
    </section>
  );
}

function Stalled({ onCheck, onRetry }: { onCheck: () => void; onRetry: () => void }) {
  return (
    <section className="pay-status">
      <h1>Still waiting for M-Pesa</h1>
      <p className="pay-text">If you approved the prompt, the payment may still be on its way. If the prompt never arrived or timed out, send it again.</p>
      <PrimaryButton onClick={onCheck} className="pay-gap-lg">
        I&apos;ve paid — check again
      </PrimaryButton>
      <SecondaryButton onClick={onRetry} className="pay-gap-sm">
        Send the prompt again
      </SecondaryButton>
    </section>
  );
}

function Paid({ code, link }: { code: string; link: PaymentLink }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<{ kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string }>({ kind: 'idle' });
  const emailRef = useRef<HTMLInputElement>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setState({ kind: 'error', message: 'Enter a valid email address' });
      emailRef.current?.focus();
      return;
    }
    setState({ kind: 'sending' });
    const result = await sendReceipt(code, email);
    setState(result.ok ? { kind: 'sent' } : { kind: 'error', message: errorMessage(result, "We couldn't send the receipt") });
  }

  return (
    <section className="pay-actions" aria-live="polite">
      <div className="pay-status pay-status-flush">
        <div className="pay-badge pay-badge-success">
          <CheckIcon />
        </div>
        <h1>Payment received</h1>
        <p className="pay-text">
          {link.currency} {formatAmount(link.amount)} has been paid. You can close this page.
        </p>
      </div>
      {state.kind === 'sent' ? (
        <p className="pay-sent">Receipt sent to {email.trim()}</p>
      ) : (
        <form onSubmit={submit} className="pay-form pay-receipt" noValidate>
          <label htmlFor="email" className="pay-label">
            Email me a receipt
          </label>
          <input
            ref={emailRef}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state.kind === 'sending'}
            className="pay-input"
          />
          {state.kind === 'error' && (
            <p role="alert" className="pay-error">
              {state.message}
            </p>
          )}
          <SecondaryButton type="submit" disabled={state.kind === 'sending'} className="pay-gap-sm">
            {state.kind === 'sending' ? 'Sending…' : 'Send receipt'}
          </SecondaryButton>
        </form>
      )}
    </section>
  );
}

function Notice({ tone, title, body }: { tone: 'error' | 'warning'; title: string; body: string }) {
  return (
    <section className="pay-status pay-notice">
      <div className={`pay-badge pay-badge-${tone}`}>
        <AlertIcon />
      </div>
      <h1>{title}</h1>
      <p className="pay-text">{body}</p>
    </section>
  );
}

// The app's ElevatedButton: brand green, white bold label, 14px radius, no elevation.
function PrimaryButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} className={`pay-btn pay-btn-primary ${className}`} />;
}

function SecondaryButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} className={`pay-btn pay-btn-secondary ${className}`} />;
}

function Spinner({ large = false }: { large?: boolean }) {
  return <span aria-hidden className={`pay-spinner${large ? ' pay-spinner-large' : ''}`} />;
}

function LockIcon() {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </svg>
  );
}
