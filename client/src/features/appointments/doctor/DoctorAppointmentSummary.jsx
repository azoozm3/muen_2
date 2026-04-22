import { ExternalLink, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import HealthRecordList from "@/features/health-record/HealthRecordList";
import { ProfileLink } from "@/components/common/ProfileLink";
import StatusPill from "@/features/appointments/shared/StatusPill";

export function DoctorAppointmentSummary({ appointment }) {
  return (
    <div className="flex-1 space-y-3">
      <div>
        <h3 className="text-lg font-semibold"><ProfileLink id={appointment.patientId} role="patient" className="font-semibold">{appointment.patientName}</ProfileLink></h3>
        <p className="text-sm text-muted-foreground">{appointment.date} at {appointment.time}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full border px-2 py-1 text-xs font-medium">{appointment.appointmentType === "online" ? "Online consultation" : "In-person appointment"}</span>
          {appointment.appointmentType === "online" ? <Video className="h-4 w-4" /> : null}
        </div>
        {appointment.patientPhone ? <p className="text-sm">Call patient: <a href={`tel:${appointment.patientPhone}`} className="font-medium text-primary underline underline-offset-4">{appointment.patientPhone}</a></p> : <p className="text-sm text-muted-foreground">No phone number</p>}
        {appointment.patientAddress ? <p className="text-sm text-muted-foreground">Address: {appointment.patientAddress}</p> : null}
        {appointment.specialty ? <p className="text-sm text-muted-foreground">Specialty: {appointment.specialty}</p> : null}
        {appointment.reason ? <p className="text-sm">Reason: {appointment.reason}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusPill status={appointment.status} />
        {appointment.reviewSubmitted ? <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">Patient rated doctor</span> : null}
      </div>

      {appointment.appointmentType === "online" && appointment.status === "confirmed" ? (
        <div className="rounded-xl border bg-muted/20 p-4 text-sm">
          {appointment.zoomStartUrl || appointment.zoomJoinUrl ? (
            <div className="space-y-2">
              <p className="font-medium">Zoom consultation is ready.</p>
              <a href={appointment.zoomStartUrl || appointment.zoomJoinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary underline underline-offset-4">
                Open Zoom meeting
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ) : <p className="text-muted-foreground">Appointment confirmed. Zoom link will appear here once created.</p>}
        </div>
      ) : null}

      <div className="rounded-xl border bg-primary/5 p-4">
        <p className="mb-2 text-sm font-medium text-primary">Patient Health Record</p>
        <HealthRecordList rows={appointment.patientMedicalHistory} emptyText="The patient has not added health record rows yet." />
      </div>
    </div>
  );
}

export function DoctorAppointmentActions({ appointment, isHistory, handleStatusChange, updatePending }) {
  if (isHistory) {
    return <div className="text-sm text-muted-foreground">{appointment.status === "completed" ? "Moved to history after completion." : appointment.status === "cancelled" ? "Cancelled by the patient and saved in history." : "Rejected appointments are saved in history."}</div>;
  }

  if (appointment.status === "pending") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => handleStatusChange(appointment, "confirmed")} disabled={updatePending}>Accept</Button>
        <Button variant="destructive" onClick={() => handleStatusChange(appointment, "rejected")} disabled={updatePending}>Reject</Button>
      </div>
    );
  }

  if (appointment.status === "confirmed") {
    return <Button variant="outline" onClick={() => handleStatusChange(appointment, "completed")} disabled={updatePending}>Mark as completed</Button>;
  }

  return null;
}
