import { PAYPAL_API_BASE, requirePaypalConfig } from "./paypalConfig.js";

export async function getPaypalAccessToken() {
  const { clientId, clientSecret } = requirePaypalConfig();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json?.error_description || json?.error || "Failed to get PayPal access token");
  return json.access_token;
}

export async function paypalPost(path, accessToken, body) {
  const response = await fetch(`${PAYPAL_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const json = await response.json().catch(() => ({}));
  return { response, json };
}
