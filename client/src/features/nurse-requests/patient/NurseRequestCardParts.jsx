import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileLink } from "@/components/common/ProfileLink";
import { openMapLocation } from "@/components/nurse/nurseUtils";
import { formatRequestDate, formatRequestDay, formatRequestTime } from "@/features/nurse-requests/shared/nurseRequestDateTime";

export function EmptyState({ title, text }) {
  return (
    <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800",
    accepted: "bg-blue-100 text-blue-800",
    in_progress: "bg-purple-100 text-purple-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-rose-100 text-rose-800",
  };

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-800"}`}>{String(status || "pending").replace("_", " ")}</span>;
}

export function RequestCard({ item, actions, footer }) {
  const hasMapTarget = (item?.locationLat && item?.locationLng) || item?.address || item?.locationNote;

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{item.serviceType || "Nurse Visit"}</h3>
            <StatusBadge status={item.status} />
          </div>

          <div className="grid gap-1 text-sm text-muted-foreground md:grid-cols-2 md:gap-x-6">
            <span><strong>Day:</strong> {formatRequestDay(item.requestedDate)}</span>
            <span><strong>Time:</strong> {formatRequestTime(item.requestedTime, item.requestedDate)}</span>
            <span><strong>Date:</strong> {formatRequestDate(item.requestedDate)}</span>
            <span><strong>Nurse:</strong> {item.nurseId ? <ProfileLink id={item.nurseId} role="nurse" className="font-medium">{item.nurseName || "Assigned nurse"}</ProfileLink> : (item.nurseName || "Not assigned")}</span>
            <span><strong>Address:</strong> {item.address || item.locationNote || "—"}</span>
            <span className="md:col-span-2"><strong>Location:</strong> {item.locationNote || item.location || "—"}</span>
          </div>

          {item.note ? <p className="text-sm text-muted-foreground">{item.note}</p> : null}

          {hasMapTarget ? (
            <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => openMapLocation(item)}>
              <MapPin className="h-4 w-4" />
              Open Map
            </Button>
          ) : null}
        </div>

        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>

      {footer ? <div className="mt-4">{footer}</div> : null}
    </div>
  );
}
