// Pure helpers for the payment-link checkout. No imports, so `node --test`
// can run them without a build step.

/** The link as the checkout page needs it, normalised from Comet's status response. */
export type PaymentLink = {
  shortCode: string;
  amount: number;
  currency: string;
  description: string;
  paid: boolean;
  expired: boolean;
  /** "pending", "failed", "complete"… — the state of the latest payment attempt. */
  transactionStatus: string;
};

/**
 * Comet stores amounts as Mongo Decimal128, which the Go driver serialises as
 * a string ("1130.00") or, from some paths, {"$numberDecimal": "1130.00"}.
 */
export function parseAmount(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "$numberDecimal" in value) {
    return Number((value as { $numberDecimal: unknown }).$numberDecimal);
  }
  return NaN;
}

export function toPaymentLink(body: Record<string, unknown>): PaymentLink {
  return {
    shortCode: String(body.short_code ?? ""),
    amount: parseAmount(body.amount),
    currency: String(body.currency ?? "").toUpperCase(),
    description: String(body.description ?? ""),
    paid: body.paid === true,
    expired: body.expired === true,
    transactionStatus: String(body.transaction_status ?? ""),
  };
}

/** Matches the app's `amount.toStringAsFixed(2)`, with thousands separators. */
export function formatAmount(amount: number): string {
  if (!Number.isFinite(amount)) return "—";
  return amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Turns what a Kenyan payer types (0712 345 678, +254712345678, 712345678,
 * 0112…) into the 2547XXXXXXXX / 2541XXXXXXXX form the STK push needs.
 * Returns null for anything that isn't a Safaricom-shaped mobile number.
 */
export function normalizeKenyanPhone(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith("0")) digits = "254" + digits.slice(1);
  else if (digits.length === 9) digits = "254" + digits;
  return /^254[17]\d{8}$/.test(digits) ? digits : null;
}

/** Short codes are 12 URL-safe characters; tokens are longer. Reject anything else before calling the API. */
export function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9_-]{6,64}$/.test(code);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
