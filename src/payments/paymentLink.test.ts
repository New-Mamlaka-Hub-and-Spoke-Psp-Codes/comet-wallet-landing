import { test } from "node:test";
import assert from "node:assert/strict";
import { formatAmount, isValidCode, normalizeKenyanPhone, parseAmount, toPaymentLink } from "./paymentLink.ts";

test("normalizeKenyanPhone accepts the ways people type a number", () => {
  for (const input of ["0712345678", "0712 345 678", "+254712345678", "254712345678", "712345678", "(0712)-345-678"]) {
    assert.equal(normalizeKenyanPhone(input), "254712345678", input);
  }
  assert.equal(normalizeKenyanPhone("0112345678"), "254112345678");
});

test("normalizeKenyanPhone rejects non-mobile input", () => {
  for (const input of ["", "07123", "0212345678", "25571234567", "07123456789", "0712abc678", "+1 415 555 0100"]) {
    assert.equal(normalizeKenyanPhone(input), null, input);
  }
});

test("parseAmount reads every Decimal128 shape", () => {
  assert.equal(parseAmount("1130.00"), 1130);
  assert.equal(parseAmount({ $numberDecimal: "5.50" }), 5.5);
  assert.equal(parseAmount(30), 30);
  assert.ok(Number.isNaN(parseAmount(null)));
});

test("toPaymentLink normalises the status response", () => {
  const link = toPaymentLink({ short_code: "ABC123XYZ890", amount: "1130.00", currency: "kes", description: "Rent", paid: false, expired: true, transaction_status: "failed" });
  assert.deepEqual(link, { shortCode: "ABC123XYZ890", amount: 1130, currency: "KES", description: "Rent", paid: false, expired: true, transactionStatus: "failed" });
});

test("formatAmount uses two decimals and separators", () => {
  assert.equal(formatAmount(1130), "1,130.00");
  assert.equal(formatAmount(NaN), "—");
});

test("isValidCode refuses path tricks", () => {
  assert.ok(isValidCode("ABC123XYZ890"));
  assert.ok(!isValidCode("../admin"));
  assert.ok(!isValidCode("a b"));
});
