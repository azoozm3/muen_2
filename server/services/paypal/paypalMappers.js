export function createMockOrder(pricing) {
  return { orderId: `MOCK-ORDER-${Date.now()}`, provider: "paypal", pricing, mock: true };
}

export function createMockCapture(orderId, pricing) {
  return {
    provider: "paypal",
    providerOrderId: orderId,
    captureId: `MOCK-CAP-${Date.now()}`,
    captureStatus: "COMPLETED",
    pricing,
    raw: { mock: true },
  };
}

export function createMockRefund({ captureId, currency, amount, note }) {
  return { refundId: `MOCK-REF-${Date.now()}`, refundStatus: "COMPLETED", raw: { mock: true, captureId, currency, amount, note } };
}

export function buildCreateOrderPayload(pricing, referenceId, serviceKey) {
  return {
    intent: "CAPTURE",
    purchase_units: [{
      reference_id: referenceId || `${serviceKey}-${Date.now()}`,
      description: pricing.label,
      amount: { currency_code: "USD", value: Number(pricing.grossAmount).toFixed(2) },
    }],
  };
}

export function mapPaypalOrderResult(json, pricing) {
  return { orderId: json.id, provider: "paypal", pricing };
}

export function mapPaypalCaptureResult(json, orderId, pricing) {
  const capture = json?.purchase_units?.[0]?.payments?.captures?.[0];
  if (!capture?.id) throw new Error("PayPal capture id is missing");
  return { provider: "paypal", providerOrderId: orderId, captureId: capture.id, captureStatus: capture.status, pricing, raw: json };
}

export function buildRefundPayload({ currency, amount, note }) {
  const payload = {};
  if (amount && currency) payload.amount = { currency_code: currency, value: Number(amount).toFixed(2) };
  if (note) payload.note_to_payer = note;
  return payload;
}

export function mapRefundResult(json) {
  return { refundId: json.id, refundStatus: json.status, raw: json };
}

export function getPaypalError(json, fallback) {
  return json?.message || json?.details?.[0]?.description || fallback;
}
