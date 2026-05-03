import mongoose from "mongoose";

export function createPricingSnapshotSchema({
  serviceKey,
  label,
}) {
  return new mongoose.Schema(
    {
      serviceKey: { type: String, default: serviceKey },
      label: { type: String, default: label, trim: true },
      currency: { type: String, default: "USD", trim: true },
      grossAmount: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      providerNetAmount: { type: Number, default: 0 },
    },
    { _id: false },
  );
}

export function createPaymentSchema() {
  return new mongoose.Schema(
    {
      paymentRef: { type: String, default: "", trim: true, index: true },
      provider: { type: String, default: "paypal", trim: true },
      providerOrderId: { type: String, default: "", trim: true },
      captureId: { type: String, default: "", trim: true },
      refundId: { type: String, default: "", trim: true },
      status: { type: String, enum: ["pending", "captured", "refunded", "failed"], default: "pending" },
      currency: { type: String, default: "USD", trim: true },
      grossAmount: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      providerNetAmount: { type: Number, default: 0 },
      paidAt: { type: Date, default: null },
      providerPayoutStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
      providerPayoutAt: { type: Date, default: null },
      providerPayoutMarkedBy: { type: String, default: "", trim: true },
      refundedAt: { type: Date, default: null },
      refundReason: { type: String, default: "", trim: true },
    },
    { _id: false },
  );
}
