import { motion } from "framer-motion";
import { Ambulance, CheckCircle2, Clock, Flag, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InfoRow({ icon: Icon, label, value, valueClassName = "" }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className={`text-right text-sm font-medium ${valueClassName}`.trim()}>{value}</span>
    </div>
  );
}

export function RouteStatusDetails({ request, currentDistanceKm, eta, progress }) {
  if (request.status === "on_the_way") {
    return (
      <>
        <InfoRow icon={Ambulance} label="Status" value="En Route" valueClassName="text-indigo-600" />
        <InfoRow icon={Clock} label="ETA" value={eta ? `${eta} min` : "Waiting for route"} />
        <InfoRow label="Distance to patient" value={Number.isFinite(currentDistanceKm) ? `${currentDistanceKm.toFixed(2)} km` : "Waiting for both GPS signals"} />
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Travel Progress</span><span className="font-medium">{Math.round(progress)}%</span></div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
          </div>
        </div>
      </>
    );
  }

  if (request.status === "arrived") {
    return <InfoRow icon={Flag} label="Status" value="At Patient Location" valueClassName="text-purple-600" />;
  }

  return null;
}

export function RouteActionButton({ request, onStatusUpdate, isUpdating }) {
  const requestId = request.id || request._id;
  if (request.status === "accepted") return <Button className="w-full" onClick={() => onStatusUpdate(requestId, "on_the_way")} disabled={isUpdating}><Play className="mr-2 h-4 w-4" /> Start Route</Button>;
  if (request.status === "on_the_way") return <Button className="w-full" onClick={() => onStatusUpdate(requestId, "arrived")} disabled={isUpdating}><Flag className="mr-2 h-4 w-4" /> Mark Arrived</Button>;
  if (request.status === "arrived") return <Button className="w-full" variant="secondary" onClick={() => onStatusUpdate(requestId, "resolved")} disabled={isUpdating}><CheckCircle2 className="mr-2 h-4 w-4" /> Mark Resolved</Button>;
  return null;
}
