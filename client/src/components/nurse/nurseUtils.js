export function normalizeId(value) {
  if (value === undefined || value === null) return "";
  const normalized = String(value).trim();
  if (
    !normalized ||
    normalized === "undefined" ||
    normalized === "null" ||
    normalized === "[object Object]"
  )
    return "";
  return normalized;
}

export function getEntityId(item) {
  return (
    normalizeId(item?.id) ||
    normalizeId(item?._id) ||
    normalizeId(item?.publicRequestId) ||
    ""
  );
}

export function getUserId(user) {
  return normalizeId(user?.id) || normalizeId(user?._id) || "";
}

export function getMapUrl({
  address = "",
  locationNote = "",
  locationLat = "",
  locationLng = "",
} = {}) {
  const lat = String(locationLat || "").trim();
  const lng = String(locationLng || "").trim();

  if (lat && lng) {
    return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`;
  }

  const query = [address, locationNote].filter(Boolean).join(", ").trim();
  if (!query) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function openMapLocation(payload) {
  const url = getMapUrl(payload);
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}
