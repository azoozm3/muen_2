import { getServicePricing } from "./app-settings.service.js";
import { getPaypalAccessToken, paypalPost } from "./paypal/paypalClient.js";
import { isMockPaypalMode } from "./paypal/paypalConfig.js";
import { buildCreateOrderPayload, buildRefundPayload, createMockCapture, createMockOrder, createMockRefund, getPaypalError, mapPaypalCaptureResult, mapPaypalOrderResult, mapRefundResult } from "./paypal/paypalMappers.js";

export async function createPaypalOrder({ serviceKey, referenceId }) {
  const pricing = await getServicePricing(serviceKey);
  if (isMockPaypalMode()) return createMockOrder(pricing);

  const accessToken = await getPaypalAccessToken();
  const { response, json } = await paypalPost("/v2/checkout/orders", accessToken, buildCreateOrderPayload(pricing, referenceId, serviceKey));
  if (!response.ok) throw new Error(getPaypalError(json, "Failed to create PayPal order"));
  return mapPaypalOrderResult(json, pricing);
}

export async function capturePaypalOrder({ orderId, serviceKey }) {
  const pricing = await getServicePricing(serviceKey);
  if (isMockPaypalMode()) return createMockCapture(orderId, pricing);

  const accessToken = await getPaypalAccessToken();
  const { response, json } = await paypalPost(`/v2/checkout/orders/${orderId}/capture`, accessToken);
  if (!response.ok) throw new Error(getPaypalError(json, "Failed to capture PayPal order"));
  return mapPaypalCaptureResult(json, orderId, pricing);
}

export async function refundPayPalCapture({ captureId, currency, amount, note }) {
  if (isMockPaypalMode()) return createMockRefund({ captureId, currency, amount, note });

  const accessToken = await getPaypalAccessToken();
  const { response, json } = await paypalPost(`/v2/payments/captures/${captureId}/refund`, accessToken, buildRefundPayload({ currency, amount, note }));
  if (!response.ok) throw new Error(getPaypalError(json, "Failed to refund PayPal payment"));
  return mapRefundResult(json);
}
