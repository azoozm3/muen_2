import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, CheckCircle, Ambulance, MapPin } from "lucide-react";


export function StatusBadge({ status, className }) {
  const styles = {
    pending: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      icon: Clock,
      label: "Pending",
    },
    accepted: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: CheckCircle2,
      label: "Accepted",
    },
    on_the_way: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      icon: Ambulance,
      label: "On The Way",
    },
    arrived: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      icon: MapPin,
      label: "Arrived",
    },
    resolved: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: CheckCircle,
      label: "Resolved",
    },
    cancelled: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      icon: CheckCircle,
      label: "Cancelled",
    },
  };

  const config = styles[status] || styles.pending;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </div>
  );
}
