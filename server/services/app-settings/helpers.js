import { DEFAULT_SETTINGS } from "./defaults.js";

export function ensureSettingsShape(settings) {
  let needsSave = false;

  if (!settings.servicePricing?.appointment) {
    settings.servicePricing.appointment = DEFAULT_SETTINGS.servicePricing.appointment;
    needsSave = true;
  }
  if (!settings.servicePricing?.nurseRequest) {
    settings.servicePricing.nurseRequest = DEFAULT_SETTINGS.servicePricing.nurseRequest;
    needsSave = true;
  }
  if (!settings.paymentProvider?.provider) {
    settings.paymentProvider = DEFAULT_SETTINGS.paymentProvider;
    needsSave = true;
  }
  if (!settings.paymentProvider?.paypalClientIdPublic && DEFAULT_SETTINGS.paymentProvider.paypalClientIdPublic) {
    settings.paymentProvider.paypalClientIdPublic = DEFAULT_SETTINGS.paymentProvider.paypalClientIdPublic;
    needsSave = true;
  }

  return needsSave;
}

export function serviceKeyToLabel(serviceKey) {
  return serviceKey === "nurseRequest" ? "Home Nurse Visit" : "Doctor Appointment";
}

export function toServicePricing(serviceKey, pricing) {
  const price = Number(pricing.price || 0);
  const platformFee = Number(pricing.platformFee || 0);
  return {
    serviceKey,
    label: pricing.label || serviceKeyToLabel(serviceKey),
    currency: pricing.currency || "USD",
    grossAmount: price,
    platformFee,
    providerNetAmount: Math.max(price - platformFee, 0),
    active: pricing.active !== false,
  };
}

export function toPublicSettings(settingsDoc) {
  const settings = settingsDoc?.toObject ? settingsDoc.toObject() : settingsDoc;
  const withProviderNet = (row) => ({ ...row, providerNet: Math.max(Number(row.price || 0) - Number(row.platformFee || 0), 0) });
  return {
    servicePricing: {
      appointment: withProviderNet(settings.servicePricing.appointment),
      nurseRequest: withProviderNet(settings.servicePricing.nurseRequest),
    },
    paymentProvider: settings.paymentProvider,
  };
}

export function mergePricingRow(currentRow, patch = {}) {
  return {
    ...(currentRow.toObject?.() || currentRow),
    ...patch,
    price: Number(patch.price ?? currentRow.price),
    platformFee: Number(patch.platformFee ?? currentRow.platformFee),
    active: patch.active ?? currentRow.active,
  };
}

export function mergePaymentProvider(currentRow, patch = {}) {
  return { ...(currentRow.toObject?.() || currentRow), ...patch };
}
