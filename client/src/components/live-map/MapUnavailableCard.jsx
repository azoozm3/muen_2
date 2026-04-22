import { MapPin } from "lucide-react";

export function MapUnavailableCard({ height, compact }) {
  return (
    <div className={`overflow-hidden rounded-xl border bg-slate-50 ${compact ? "" : "shadow-sm"}`}>
      <div className={`flex ${height} flex-col items-center justify-center gap-2 px-4 text-center`}>
        <div className="rounded-full bg-primary/10 p-3 text-primary"><MapPin className="h-5 w-5" /></div>
        <div>
          <p className="font-medium">Live map unavailable</p>
          <p className="text-sm text-muted-foreground">GPS coordinates have not been shared for this request yet.</p>
        </div>
      </div>
    </div>
  );
}
