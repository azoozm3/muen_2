export function getAdminLocationLink({
  address = "",
  location = "",
  locationNote = "",
  latitude = null,
  longitude = null,
  locationLat = "",
  locationLng = "",
} = {}) {
  const parsedLat = latitude ?? (locationLat !== "" ? Number(locationLat) : null);
  const parsedLng = longitude ?? (locationLng !== "" ? Number(locationLng) : null);
  const hasCoordinates = Number.isFinite(parsedLat) && Number.isFinite(parsedLng);

  const text =
    [location, address, locationNote].filter(Boolean)[0] ||
    (hasCoordinates ? "Live location captured" : "—");

  const query = [address, location, locationNote].filter(Boolean).join(", ");
  const href = hasCoordinates
    ? `https://maps.google.com/?q=${parsedLat},${parsedLng}`
    : query
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      : "";

  return { text, href };
}
