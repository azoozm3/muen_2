function getPendingPayments(req) {
  if (!req.session.pendingPayments || typeof req.session.pendingPayments !== "object") {
    req.session.pendingPayments = {};
  }
  return req.session.pendingPayments;
}

function buildPaymentRef(prefix = "PAY") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

export function saveCapturedPaymentSession(req, { orderId, serviceKey, provider, providerOrderId, captureId, pricing }) {
  const payments = getPendingPayments(req);
  const prefix = serviceKey === "nurseRequest" ? "NURPAY" : "APPPAY";

  payments[orderId] = {
    serviceKey,
    pricing,
    payment: {
      paymentRef: buildPaymentRef(prefix),
      provider,
      providerOrderId,
      captureId,
      status: "captured",
      currency: pricing.currency,
      grossAmount: pricing.grossAmount,
      platformFee: pricing.platformFee,
      providerNetAmount: pricing.providerNetAmount,
      paidAt: new Date().toISOString(),
    },
  };

  return payments[orderId];
}

export function consumeCapturedPayment(req, orderId, serviceKey) {
  const payments = getPendingPayments(req);
  const captured = payments?.[orderId];

  if (!captured) {
    throw new Error("Payment session expired. Please complete PayPal again.");
  }

  if (captured.serviceKey !== serviceKey) {
    throw new Error("Payment does not match this service.");
  }

  delete payments[orderId];
  return captured;
}
