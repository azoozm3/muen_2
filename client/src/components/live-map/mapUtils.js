export function isValidCoord(latitude, longitude) {
  return Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));
}

export function buildOpenUrl(primaryMarker, secondaryMarker) {
  if (!primaryMarker) return null;
  if (secondaryMarker) return `https://www.google.com/maps/dir/${secondaryMarker.latitude},${secondaryMarker.longitude}/${primaryMarker.latitude},${primaryMarker.longitude}`;
  return `https://www.google.com/maps?q=${primaryMarker.latitude},${primaryMarker.longitude}`;
}

export function buildLeafletEmbedHtml(primaryMarker, secondaryMarker) {
  const markers = [primaryMarker, secondaryMarker].filter(Boolean);
  const avgLat = markers.reduce((sum, marker) => sum + marker.latitude, 0) / markers.length;
  const avgLng = markers.reduce((sum, marker) => sum + marker.longitude, 0) / markers.length;

  const markerScript = markers.map((marker) => {
    const popup = `${marker.label}<br/>${marker.latitude.toFixed(5)}, ${marker.longitude.toFixed(5)}`;
    return `L.marker([${marker.latitude}, ${marker.longitude}]).addTo(map).bindPopup(${JSON.stringify(popup)});`;
  }).join("\n");

  const fitBounds = markers.length > 1
    ? `const bounds = L.latLngBounds([${markers.map((marker) => `[${marker.latitude}, ${marker.longitude}]`).join(",")}]); map.fitBounds(bounds.pad(0.25));`
    : `map.setView([${avgLat}, ${avgLng}], 15);`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>html, body, #map { height: 100%; margin: 0; } body { font-family: sans-serif; }</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map', { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map);
    ${markerScript}
    ${fitBounds}
  </script>
</body>
</html>`;
}
