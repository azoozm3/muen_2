import { isZoomEnabled, getZoomCredentials } from "./zoom.config.js";

const ZOOM_TOKEN_URL = "https://zoom.us/oauth/token";
const ZOOM_API_BASE_URL = "https://api.zoom.us/v2";

function createBasicAuthToken(clientId, clientSecret) {
  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function getZoomAccessToken() {
  const { accountId, clientId, clientSecret } = getZoomCredentials();

  if (!accountId || !clientId || !clientSecret) {
    throw new Error("Zoom credentials are missing");
  }

  const url = `${ZOOM_TOKEN_URL}?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${createBasicAuthToken(clientId, clientSecret)}`,
    },
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok || !payload?.access_token) {
    throw new Error(payload?.reason || payload?.message || "Failed to get Zoom access token");
  }

  return payload.access_token;
}

function buildMeetingPayload({ topic, startTime, duration, timezone }) {
  return {
    topic,
    type: 2,
    start_time: startTime,
    duration,
    timezone,
    settings: {
      join_before_host: false,
      waiting_room: true,
      participant_video: true,
      host_video: true,
    },
  };
}

export async function createZoomMeeting({ topic, startTime, duration = 30, timezone = "Asia/Amman" }) {
  if (!isZoomEnabled()) {
    return {
      enabled: false,
      skipped: true,
      reason: "Zoom credentials are not configured",
    };
  }

  const accessToken = await getZoomAccessToken();
  const response = await fetch(`${ZOOM_API_BASE_URL}/users/me/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      buildMeetingPayload({
        topic,
        startTime,
        duration,
        timezone,
      }),
    ),
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(payload?.message || "Failed to create Zoom meeting");
  }

  return {
    enabled: true,
    skipped: false,
    meetingId: payload?.id ? String(payload.id) : "",
    joinUrl: payload?.join_url || "",
    startUrl: payload?.start_url || "",
    password: payload?.password || "",
    raw: payload,
  };
}
