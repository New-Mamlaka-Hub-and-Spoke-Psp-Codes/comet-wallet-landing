import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import Checkout, { CheckoutShell } from '../payments/Checkout';
import { fetchLink } from '../payments/api';
import { formatAmount, isValidCode, type PaymentLink as Link } from '../payments/paymentLink';
import '../payments/payments.css';

type Loaded = { link: Link | null; error: string | null; qr: string | null };

// The QR a desktop payer scans with Comet Wallet: this page's own URL, which
// the app's scanner (and the phone camera, via app links) opens in the app's
// native pay screen.
function walletQR(code: string): Promise<string> {
  const url = `${window.location.origin}/payments/${encodeURIComponent(code)}`;
  return QRCode.toString(url, { type: 'svg', margin: 0, color: { dark: '#2ccb41', light: '#0000' } });
}

export default function PaymentLink() {
  const { code = '' } = useParams();
  // Inside the app's own webview (its M-Pesa option) the wallet choice is
  // already on the native screen behind it.
  const fromApp = useSearchParams()[0].get('source') === 'app';
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = isValidCode(code) ? await fetchLink(code) : { link: null, error: 'Payment link not found' };
      const qr = result.link && !fromApp ? await walletQR(code).catch(() => null) : null;
      if (!cancelled) setLoaded({ ...result, qr });
    })();
    return () => {
      cancelled = true;
    };
  }, [code, fromApp]);

  useEffect(() => {
    const link = loaded?.link;
    document.title = link ? `Pay ${link.currency} ${formatAmount(link.amount)} · Comet` : 'Payment link · Comet';
  }, [loaded]);

  if (!loaded) {
    return (
      <CheckoutShell>
        <div className="pay-loading" aria-label="Loading">
          <span className="pay-spinner pay-spinner-large" />
        </div>
      </CheckoutShell>
    );
  }
  return <Checkout code={code} initialLink={loaded.link} initialError={loaded.error} walletQR={loaded.qr} />;
}
