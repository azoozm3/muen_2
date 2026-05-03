import { CalendarDays, MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { openMapLocation } from "./nurseUtils";
import { ProfileLink } from "@/components/common/ProfileLink";
import { formatRequestDate, formatRequestDay, formatRequestTime } from "@/features/nurse-requests/shared/nurseRequestDateTime";

export function StatusPill({ status }) {
  const map = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-blue-50 text-blue-700 border-blue-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    in_progress: "bg-violet-50 text-violet-700 border-violet-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${map[status] || map.pending}`}>
      {String(status || "pending").replaceAll("_", " ")}
    </span>
  );
}

function HealthRecordPreview({ rows = [] }) {
  if (!rows.length) {
    return <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No health record rows shared yet.</div>;
  }

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={`${row.recordDate || "row"}-${index}`} className="rounded-xl border bg-background p-3">
          <div className="text-sm font-semibold">{row.title || "Record"}</div>
          <div className="text-sm text-muted-foreground">{row.details}</div>
          <div className="mt-1 text-xs text-muted-foreground">{row.recordDate}</div>
        </div>
      ))}
    </div>
  );
}

export function NurseRequestCard({ item, children, showMapButton = true }) {
  const hasMapTarget = (item?.locationLat && item?.locationLng) || item?.address;

  return (
    <Card className="rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold sm:text-lg">{item.serviceType}</h3>
          <p className="text-sm text-muted-foreground">{item.publicRequestId}</p>
        </div>
        <StatusPill status={item.status} />
      </div>

      <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
        <div className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div><span className="font-medium text-foreground">Day:</span> {formatRequestDay(item.requestedDate)}</div>
            <div><span className="font-medium text-foreground">Date:</span> {formatRequestDate(item.requestedDate)}</div>
            <div><span className="font-medium text-foreground">Time:</span> {formatRequestTime(item.requestedTime, item.requestedDate)}</div>
          </div>
        </div>
        <div className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" /> <span className="break-all">{item.patientPhone || "No phone added"}</span></div>
        <div className="flex items-start gap-2 md:col-span-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <span className="block break-words">{item.address || item.locationNote || "GPS pinned"}{item.address && item.locationNote ? ` — ${item.locationNote}` : ""}</span>
            {showMapButton && hasMapTarget ? (
              <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => openMapLocation(item)}>
                Open in Map
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-muted p-3 text-sm">
        <div className="font-medium">Patient</div>
        <ProfileLink id={item.patientId} role="patient" className="font-medium">{item.patientName}</ProfileLink>
        {item.note ? <div className="mt-2 break-words text-muted-foreground">{item.note}</div> : null}
      </div>

      <div className="mt-4">
        <h4 className="mb-2 font-semibold">Health Record</h4>
        <HealthRecordPreview rows={item.healthRecordSnapshot} />
      </div>

      {children}
    </Card>
  );
}
