import { refundPayPalCapture } from "./payment-gateway.service.js";

export async function refundCapturedPayment(
  record,
  { reason = "Refunded", note = "Payment refund" } = {},
) {
  if (!record?.payment?.captureId || record?.payment?.status === "refunded") {
    return record;
  }

  const refund = await refundPayPalCapture({
    captureId: record.payment.captureId,
    currency: record.payment.currency,
    amount: record.payment.grossAmount,
    note,
  });

  record.payment.refundId = refund.refundId;
  record.payment.status = "refunded";
  record.payment.refundReason = reason;
  record.payment.refundedAt = new Date();
  await record.save();
  return record;
}
