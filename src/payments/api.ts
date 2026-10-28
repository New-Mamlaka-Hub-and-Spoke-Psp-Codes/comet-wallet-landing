import { toPaymentLink, type PaymentLink } from './paymentLink';

// Comet-dashboard's public payment-link API. In dev the Vite server proxies
// /api to the local dashboard (vite.config.ts), so the page calls its own
// origin and works from a phone on the LAN. A production build calls the API
// host directly, which must list this site in CORS_ALLOWED_ORIGINS.
function apiBase(): string {
  const configured = import.meta.env.VITE_COMET_API_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');
  return import.meta.env.PROD ? 'https://cometapi.mamlakapsp.com' : '';
}

type ApiResult = { ok: boolean; status: number; body: Record<string, unknown> };

async function call(path: string, body?: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(`${apiBase()}/api/v1/payment-links${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(30_000),
    });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: res.ok, status: res.status, body: json };
  } catch {
    return { ok: false, status: 0, body: { error: "We couldn't reach Comet. Check your connection and try again." } };
  }
}

/** Comet's error text, or a fallback when it sent none. */
export function errorMessage(result: ApiResult, fallback: string): string {
  const { error } = result.body;
  return typeof error === 'string' && error ? error : fallback;
}

export async function fetchLink(code: string): Promise<{ link: PaymentLink | null; error: string | null }> {
  const result = await call(`/${encodeURIComponent(code)}/status`);
  if (!result.ok) return { link: null, error: errorMessage(result, 'Payment link not found') };
  return { link: toPaymentLink(result.body), error: null };
}

/** Sends the M-Pesa prompt; `phone` must already be normalised (2547…). */
export function startMpesa(code: string, phone: string): Promise<ApiResult> {
  return call('/pay/momo', { code, phone });
}

export function sendReceipt(code: string, email: string): Promise<ApiResult> {
  return call(`/${encodeURIComponent(code)}/invoice`, { email: email.trim() });
}
