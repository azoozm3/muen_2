import { AlertTriangle, Ambulance, CheckCircle2, Flag, Loader2, ShieldCheck } from "lucide-react";

export function RequestStatusIcon({ status }) {
  if (status === "pending") return <Loader2 className="h-10 w-10 animate-spin text-orange-400" />;
  if (status === "accepted") return <CheckCircle2 className="h-10 w-10 text-blue-400" />;
  if (status === "on_the_way") return <Ambulance className="h-10 w-10 animate-pulse text-green-400" />;
  if (status === "arrived") return <Flag className="h-10 w-10 text-purple-400" />;
  if (status === "resolved") return <CheckCircle2 className="h-10 w-10 text-blue-400" />;
  return <AlertTriangle className="h-10 w-10 text-slate-300" />;
}

export function DetailRow({ label, value, multiLine = false }) {
  return (
    <div className={`flex justify-between border-b pb-2 ${multiLine ? "items-start" : "items-center"}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${multiLine ? "max-w-[60%] text-right" : ""}`.trim()}>{value}</span>
    </div>
  );
}

export function LiveSharingNotice() {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
      <div className="mb-1 flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4" /> Live sharing active</div>
      Your GPS location keeps updating while this screen stays open.
    </div>
  );
}
