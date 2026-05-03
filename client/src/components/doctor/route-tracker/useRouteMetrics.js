import { useMemo } from "react";
import { calculateRouteProgress, estimateEtaMinutes, haversineDistanceKm } from "@/lib/tracking";

export function useRouteMetrics(request, geoState) {
  const currentDistanceKm = useMemo(
    () => haversineDistanceKm(request.latitude, request.longitude, request.responderLatitude ?? geoState.latitude, request.responderLongitude ?? geoState.longitude),
    [request.latitude, request.longitude, request.responderLatitude, request.responderLongitude, geoState.latitude, geoState.longitude],
  );

  const eta = useMemo(() => (request.status === "on_the_way" ? estimateEtaMinutes(currentDistanceKm) : null), [currentDistanceKm, request.status]);

  const progress = useMemo(() => {
    if (request.status === "arrived") return 100;
    if (request.status !== "on_the_way") return 0;
    return calculateRouteProgress(currentDistanceKm, request.routeStartDistanceKm) ?? 0;
  }, [currentDistanceKm, request.routeStartDistanceKm, request.status]);

  return { currentDistanceKm, eta, progress };
}
