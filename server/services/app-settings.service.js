import AppSettings from "../models/AppSettings.js";
import { DEFAULT_SETTINGS } from "./app-settings/defaults.js";
import { ensureSettingsShape, mergePaymentProvider, mergePricingRow, toPublicSettings, toServicePricing } from "./app-settings/helpers.js";

export { toPublicSettings, serviceKeyToLabel } from "./app-settings/helpers.js";

export async function ensureAppSettings() {
  let settings = await AppSettings.findOne({ singletonKey: "default" });
  if (!settings) settings = await AppSettings.create(DEFAULT_SETTINGS);
  if (ensureSettingsShape(settings)) await settings.save();
  return settings;
}

export async function getServicePricing(serviceKey) {
  const settings = await ensureAppSettings();
  const pricing = settings?.servicePricing?.[serviceKey];
  if (!pricing) throw new Error(`Unknown service pricing key: ${serviceKey}`);
  return toServicePricing(serviceKey, pricing);
}

export async function updateAppSettings(payload = {}) {
  const settings = await ensureAppSettings();
  if (payload?.servicePricing?.appointment) settings.servicePricing.appointment = mergePricingRow(settings.servicePricing.appointment, payload.servicePricing.appointment);
  if (payload?.servicePricing?.nurseRequest) settings.servicePricing.nurseRequest = mergePricingRow(settings.servicePricing.nurseRequest, payload.servicePricing.nurseRequest);
  if (payload?.paymentProvider) settings.paymentProvider = mergePaymentProvider(settings.paymentProvider, payload.paymentProvider);
  await settings.save();
  return settings;
}
