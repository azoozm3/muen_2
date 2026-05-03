import { calculateRouteProgress } from "@/lib/tracking";

export function getResponderLabel(role) {
  return role === "nurse" ? "" : "Dr. ";
}

export function getRouteStatusLabel(status) {
  if (status === "accepted") return "Preparing to depart";
  if (status === "on_the_way") return "On the way";
  if (status === "arrived") return "Has arrived";
  return status;
}

export function getRouteProgress(status, distanceKm, routeStartDistanceKm) {
  if (status === "arrived") return 100;
  return calculateRouteProgress(distanceKm, routeStartDistanceKm) ?? 0;
}
