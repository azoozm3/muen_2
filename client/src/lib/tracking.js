export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const values = [lat1, lon1, lat2, lon2].map(Number);
  if (values.some((value) => !Number.isFinite(value))) return null;

  const [aLat, aLon, bLat, bLon] = values;
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const q =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(q));
}

export function estimateEtaMinutes(distanceKm, speedKmh = 35) {
  const distance = Number(distanceKm);
  if (!Number.isFinite(distance)) return null;
  if (distance <= 0.08) return 1;
  return Math.max(1, Math.ceil((distance / speedKmh) * 60));
}

export function calculateRouteProgress(currentDistanceKm, startDistanceKm) {
  const current = Number(currentDistanceKm);
  const start = Number(startDistanceKm);
  if (!Number.isFinite(current) || !Number.isFinite(start) || start <= 0) return null;

  const progress = ((start - current) / start) * 100;
  return Math.max(0, Math.min(100, progress));
}
