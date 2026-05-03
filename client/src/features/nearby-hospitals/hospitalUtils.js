import { haversineDistanceKm } from "@/lib/tracking";

export function buildDirectionsUrl(userLat, userLng, hospitalLat, hospitalLng) {
  return `https://www.google.com/maps/dir/${userLat},${userLng}/${hospitalLat},${hospitalLng}`;
}

export function buildMapsSearchUrl(lat, lng, label) {
  return `https://www.google.com/maps?q=${lat},${lng}${label ? `(${encodeURIComponent(label)})` : ""}`;
}

export function buildMapHtml(userLocation, hospitals) {
  const points = [userLocation, ...hospitals].filter(Boolean);
  const avgLat = points.reduce((sum, point) => sum + point.latitude, 0) / points.length;
  const avgLng = points.reduce((sum, point) => sum + point.longitude, 0) / points.length;
  const userMarker = userLocation ? `L.marker([${userLocation.latitude}, ${userLocation.longitude}]).addTo(map).bindPopup("<b>You are here</b>");` : "";
  const hospitalMarkers = hospitals.map((hospital) => `L.marker([${hospital.latitude}, ${hospital.longitude}]).addTo(map).bindPopup(${JSON.stringify(`<b>${hospital.name}</b><br/>${hospital.distanceText} away`)});`).join("\n");
  const fitBounds = points.length > 1 ? `const bounds = L.latLngBounds([${points.map((point) => `[${point.latitude}, ${point.longitude}]`).join(",")}]); map.fitBounds(bounds.pad(0.18));` : `map.setView([${avgLat || 31.95}, ${avgLng || 35.91}], 14);`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><style>html, body, #map { height: 100%; margin: 0; } body { font-family: sans-serif; }</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>const map = L.map('map', { zoomControl: true });L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map);${userMarker}${hospitalMarkers}${fitBounds}</script></body></html>`;
}

export async function fetchNearbyHospitals(latitude, longitude) {
  const radiusMeters = 6000;
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude});
      way["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude});
      relation["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude});
      node["healthcare"="hospital"](around:${radiusMeters},${latitude},${longitude});
      way["healthcare"="hospital"](around:${radiusMeters},${latitude},${longitude});
      relation["healthcare"="hospital"](around:${radiusMeters},${latitude},${longitude});
      node["amenity"="clinic"](around:${radiusMeters},${latitude},${longitude});
      way["amenity"="clinic"](around:${radiusMeters},${latitude},${longitude});
      relation["amenity"="clinic"](around:${radiusMeters},${latitude},${longitude});
    );
    out center tags;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: query,
  });

  if (!response.ok) throw new Error("Unable to load nearby hospitals right now.");

  const data = await response.json();
  const seen = new Set();

  return (data.elements || [])
    .map((item) => {
      const lat = Number(item.lat ?? item.center?.lat);
      const lng = Number(item.lon ?? item.center?.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

      const name = item.tags?.name || item.tags?.["name:en"] || item.tags?.operator || "Nearby hospital";
      const street = item.tags?.["addr:street"] || "";
      const distanceKm = haversineDistanceKm(latitude, longitude, lat, lng);
      const uniqueKey = `${name}-${lat.toFixed(5)}-${lng.toFixed(5)}`;
      if (seen.has(uniqueKey)) return null;
      seen.add(uniqueKey);

      return {
        id: uniqueKey,
        name,
        street,
        latitude: lat,
        longitude: lng,
        distanceKm,
        distanceText: Number.isFinite(distanceKm) ? (distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(2)} km`) : "Unknown distance",
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    .slice(0, 5);
}
