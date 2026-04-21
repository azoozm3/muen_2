import { roundMoney, safeNumber } from "../utils.js";

export function paymentSnapshot(item = {}) {
  const snapshot = item.pricingSnapshot || {};
  const payment = item.payment || {};
  const grossAmount = safeNumber(payment.grossAmount, safeNumber(snapshot.totalPrice));
  const platformFee = safeNumber(payment.platformFee, safeNumber(snapshot.platformFee));
  const providerNetAmount = safeNumber(payment.providerNetAmount, safeNumber(snapshot.providerPayout));

  return {
    status: payment.status || payment.paymentStatus || "pending",
    paymentStatus: payment.paymentStatus || payment.status || "pending",
    paymentRef: payment.paymentRef || payment.captureId || payment.orderId || "",
    grossAmount: roundMoney(grossAmount),
    platformFee: roundMoney(platformFee),
    providerNetAmount: roundMoney(providerNetAmount),
    currency: payment.currency || snapshot.currency || "USD",
    refunded: Boolean(payment.refunded),
    providerPayoutStatus: payment.providerPayoutStatus || (providerNetAmount > 0 ? "pending" : "n/a"),
    providerPayoutAt: payment.providerPayoutAt || null,
  };
}
