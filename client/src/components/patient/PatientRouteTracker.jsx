import { estimateEtaMinutes, haversineDistanceKm } from "@/lib/tracking";
import { PatientRouteDetails } from "./route-tracker/PatientRouteDetails";

export function PatientRouteTracker({ request }) {
  const responderName = request.primaryResponderName || request.acceptedByName || "Medical Professional";
  const responderRole = request.primaryResponderRole || "doctor";
  const status = request.status;
  const distanceKm = haversineDistanceKm(request.latitude, request.longitude, request.responderLatitude, request.responderLongitude);
  const eta = status === "on_the_way" ? estimateEtaMinutes(distanceKm) : null;

  return <PatientRouteDetails request={request} status={status} responderName={responderName} responderRole={responderRole} distanceKm={distanceKm} eta={eta} />;
}
