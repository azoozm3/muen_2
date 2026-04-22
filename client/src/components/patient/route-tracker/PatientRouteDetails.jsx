import { Ambulance, Clock, Flag, MapPin, Navigation, User } from "lucide-react";
import { motion } from "framer-motion";
import { LiveLocationMap } from "@/components/LiveLocationMap";
import { getResponderLabel, getRouteProgress, getRouteStatusLabel } from "./patientRouteTrackerUtils";

export function PatientRouteDetails({ request, status, responderName, responderRole, distanceKm, eta }) {
  const progress = getRouteProgress(status, distanceKm, request.routeStartDistanceKm);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
      <div className="rounded-xl border bg-gradient-to-b from-slate-50 to-white p-5">
        <div className="mb-4 flex items-center gap-2"><Navigation className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Live Route Tracking</h3></div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Responder</span></div>
            {request.primaryResponderId ? <a href={`/provider/${request.primaryResponderId}`} className="font-medium text-primary hover:underline" data-testid="text-assigned-doctor">{getResponderLabel(responderRole)}{responderName}</a> : <span className="font-medium" data-testid="text-assigned-doctor">{getResponderLabel(responderRole)}{responderName}</span>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">{status === "arrived" ? <Flag className="h-4 w-4 text-purple-600" /> : <Ambulance className="h-4 w-4 text-green-600" />}<span className="text-sm text-muted-foreground">Status</span></div>
            <span className={`font-medium ${status === "arrived" ? "text-purple-600" : "text-green-600"}`} data-testid="text-route-status">{getRouteStatusLabel(status)}</span>
          </div>

          {status === "on_the_way" ? (
            <>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Est. Arrival</span></div><span className="font-medium" data-testid="text-eta">{eta ? `${eta} min` : "Waiting for responder GPS"}</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Responder distance</span></div><span className="font-medium">{Number.isFinite(distanceKm) ? `${distanceKm.toFixed(2)} km away` : "Waiting for responder GPS"}</span></div>
            </>
          ) : null}

          {(status === "accepted" || status === "on_the_way") ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Travel Progress</span><span className="font-medium">{Math.round(progress)}%</span></div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted"><motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} /></div>
            </div>
          ) : null}

          {status === "arrived" ? <div className="rounded-lg bg-purple-50 p-3 text-center text-sm font-medium text-purple-800">Your medical responder has arrived at your location</div> : null}

          <LiveLocationMap latitude={request.latitude} longitude={request.longitude} secondaryLatitude={request.responderLatitude} secondaryLongitude={request.responderLongitude} secondaryLabel="Responder" title="Patient + responder live map" description="You can follow your responder while they follow your live location." height="h-44" compact />
        </div>
      </div>
    </motion.div>
  );
}
