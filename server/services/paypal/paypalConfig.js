import { hasPaypalCredentials, serverEnv } from "../../config/app-env.js";

export const PAYPAL_API_BASE =
  serverEnv.paypalMode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export function isMockPaypalMode() {
  return serverEnv.paypalMode === "mock" || !hasPaypalCredentials;
}

export function requirePaypalConfig() {
  if (!hasPaypalCredentials) {
    throw new Error("PayPal credentials are missing. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to .env.");
  }

  return {
    clientId: serverEnv.paypalClientId,
    clientSecret: serverEnv.paypalClientSecret,
  };
}
