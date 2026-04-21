import { StatusBadge } from "@/components/StatusBadge";
import { ProfileLink } from "@/components/common/ProfileLink";
import { getCaseDisplayId } from "../doctorUtils";

export function DoctorCardHeader({ request, showCaseId = true }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <h3 className="text-lg font-bold">Emergency Help</h3>
        {showCaseId ? <p className="text-sm text-muted-foreground">{getCaseDisplayId(request)}</p> : null}
      </div>
      <StatusBadge status={request.status} />
    </div>
  );
}

export function SummaryRow({ label, value, isPhone = false }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      {isPhone ? <a href={`tel:${value}`} className="font-medium text-primary underline underline-offset-4">{value}</a> : <span className="font-medium">{value}</span>}
    </div>
  );
}

export function BlockRow({ label, value }) {
  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">{label}</div>
      <div className="rounded-lg border bg-white p-3 text-sm">{value}</div>
    </div>
  );
}

export function HighlightRow({ label, value }) {
  return (
    <div className="rounded-lg bg-blue-50 p-3 text-sm"><span className="text-muted-foreground">{label}: </span><span className="font-medium">{value}</span></div>
  );
}

export function PatientSummary({ request, showCaseId = false, showPrimary = false }) {
  return (
    <div className="space-y-3 rounded-xl border bg-slate-50 p-4">
      {showCaseId ? <SummaryRow label="Case ID" value={getCaseDisplayId(request)} /> : null}
      <SummaryRow label="Patient" value={<ProfileLink id={request.patientId} role="patient" className="font-medium">{request.name}</ProfileLink>} />
      <SummaryRow label="Call patient" value={request.patientPhone || "No phone number"} isPhone={!!request.patientPhone} />
      <BlockRow label="Location" value={request.location} />
      {showPrimary && request.primaryResponderName ? <HighlightRow label="Primary" value={`${request.primaryResponderName} (${request.primaryResponderRole})`} /> : null}
    </div>
  );
}
