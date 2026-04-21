import { motion } from "framer-motion";
import { Ambulance, MapPin, Navigation, Phone, User } from "lucide-react";
import { LiveLocationMap } from "@/components/LiveLocationMap";
import { ACTIVE_TRACKING_STATUSES } from "./route-tracker/constants";
import { InfoRow, RouteActionButton, RouteStatusDetails } from "./route-tracker/RouteTrackerParts";
import { useDoctorGpsSharing } from "./route-tracker/useDoctorGpsSharing";
import { useRouteMetrics } from "./route-tracker/useRouteMetrics";

export function DoctorRouteTracker({ request, onStatusUpdate, isUpdating }) {
  const geoState = useDoctorGpsSharing(request);
  const { currentDistanceKm, eta, progress } = useRouteMetrics(request, geoState);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="rounded-xl border bg-gradient-to-b from-slate-50 to-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Route to Patient</h3>
        </div>

        <div className="space-y-3">
          <InfoRow icon={User} label="Patient" value={request.name} />
          <InfoRow icon={MapPin} label="Patient location" value={request.location} />
          <InfoRow icon={Phone} label="Call patient" value={request.patientPhone || "No phone number"} />

          {ACTIVE_TRACKING_STATUSES.includes(request.status) ? (
            <InfoRow
              icon={Ambulance}
              label="Responder GPS"
              value={Number.isFinite(request.responderLatitude) && Number.isFinite(request.responderLongitude) ? `${request.responderLatitude.toFixed(5)}, ${request.responderLongitude.toFixed(5)}` : "Waiting for your location"}
            />
          ) : null}

          <RouteStatusDetails request={request} currentDistanceKm={currentDistanceKm} eta={eta} progress={progress} />

          {geoState.error ? <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{geoState.error}</div> : null}

          <LiveLocationMap
            latitude={request.latitude}
            longitude={request.longitude}
            secondaryLatitude={request.responderLatitude ?? geoState.latitude}
            secondaryLongitude={request.responderLongitude ?? geoState.longitude}
            secondaryLabel="Responder"
            height="h-44"
            compact
          />
        </div>

        <div className="mt-4 flex gap-3">
          <RouteActionButton request={request} onStatusUpdate={onStatusUpdate} isUpdating={isUpdating} />
        </div>
      </div>
    </motion.div>
  );
}
