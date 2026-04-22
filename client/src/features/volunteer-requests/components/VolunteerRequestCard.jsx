import { MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProfileLink } from "@/components/common/ProfileLink";
import { getVolunteerStatusMeta } from "@/features/volunteer-requests/volunteerUtils";

const urgencyClasses = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-rose-200 bg-rose-50 text-rose-700",
};

export function VolunteerStatusPill({ status }) {
  const meta = getVolunteerStatusMeta(status);
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}>{meta.label}</span>;
}

export function VolunteerUrgencyPill({ urgency = "medium" }) {
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${urgencyClasses[urgency] || urgencyClasses.medium}`}>{urgency}</span>;
}

export function VolunteerLocationDetails({ item }) {
  const mapLink = item?.latitude != null && item?.longitude != null ? `https://maps.google.com/?q=${item.latitude},${item.longitude}` : "";

  return (
    <div className="space-y-1">
      <p className="flex items-start gap-2 break-words"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> <span>{item.address || "Live location captured"}</span></p>
      {item.locationNote ? <p className="text-muted-foreground">{item.locationNote}</p> : null}
      {mapLink ? <a className="inline-flex text-xs font-medium text-primary hover:underline" href={mapLink} target="_blank" rel="noreferrer">Open live location</a> : null}
    </div>
  );
}

export function VolunteerRequestCard({ item, children, showVolunteer = true, showPatient = true }) {
  return (
    <Card className="rounded-3xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold sm:text-lg">{item.serviceType || "Volunteer request"}</h3>
            <VolunteerStatusPill status={item.status} />
            <VolunteerUrgencyPill urgency={item.urgency} />
          </div>

          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            {showPatient && item.patientName ? <p className="font-medium text-foreground">{item.patientId ? <ProfileLink id={item.patientId} role="patient" className="font-medium">{item.patientName}</ProfileLink> : item.patientName}</p> : null}
            {showPatient && item.patientPhone ? <p className="flex items-center gap-2 break-all"><Phone className="h-4 w-4 shrink-0" /> {item.patientPhone}</p> : null}
            <VolunteerLocationDetails item={item} />
            {item.details ? <p className="whitespace-pre-wrap break-words">{item.details}</p> : null}
            {showVolunteer && item.volunteerName ? <p>Volunteer: {item.volunteerId ? <ProfileLink id={item.volunteerId} role="volunteer" className="font-medium text-foreground">{item.volunteerName}</ProfileLink> : <span className="font-medium text-foreground">{item.volunteerName}</span>}</p> : null}
            {showVolunteer && item.volunteerPhone ? <p className="flex items-center gap-2 break-all"><Phone className="h-4 w-4 shrink-0" /> {item.volunteerPhone}</p> : null}
          </div>
        </div>

        {children ? <div className="flex flex-col gap-2">{children}</div> : null}
      </div>
    </Card>
  );
}

export function VolunteerEmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center sm:p-12">
      <MapPin className="mb-4 h-10 w-10 text-muted-foreground" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
