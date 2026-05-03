import { ExternalLink, TriangleAlert, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileLink } from "@/components/common/ProfileLink";
import PrescriptionList from "@/features/appointments/PrescriptionList";
import StatusPill from "@/features/appointments/shared/StatusPill";
import AppointmentReviewForm from "./AppointmentReviewForm";

export default function PatientAppointmentCard({ appointment, isHistory = false, cancelAppointment, cancelPending, reviewProps }) {
  const appointmentId = appointment.id || appointment._id;

  return (
    <Card key={appointmentId} className="rounded-2xl p-5">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold"><ProfileLink id={appointment.doctorId} role="doctor" className="font-semibold">{appointment.doctorName}</ProfileLink></h3>
          <p className="text-sm text-muted-foreground">{appointment.date} at {appointment.time}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-full border px-2 py-1 text-xs font-medium">{appointment.appointmentType === "online" ? "Online consultation" : "In-person appointment"}</span>
            {appointment.appointmentType === "online" ? <Video className="h-4 w-4" /> : null}
          </div>
          {appointment.specialty ? <p className="text-sm text-muted-foreground">{appointment.specialty}</p> : null}
          {appointment.reason ? <p className="mt-2 text-sm">Reason: {appointment.reason}</p> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={appointment.status} />
          {appointment.reviewSubmitted ? <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">Review sent</span> : null}
        </div>

        {appointment.consultationSummary || appointment.consultationNotes ? (
          <div className="rounded-xl border bg-primary/5 p-4">
            <p className="mb-1 text-sm font-medium text-primary">Consultation summary</p>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{appointment.consultationSummary || appointment.consultationNotes}</p>
          </div>
        ) : null}

        {Array.isArray(appointment.prescription) && appointment.prescription.length > 0 ? (
          <div>
            <p className="mb-2 text-sm font-medium">Prescription</p>
            <PrescriptionList items={appointment.prescription} />
          </div>
        ) : null}

        {appointment.appointmentType === "online" && appointment.status === "confirmed" ? (
          <div className="rounded-xl border bg-muted/20 p-4 text-sm">
            {appointment.zoomJoinUrl ? (
              <div className="space-y-2">
                <p className="font-medium">Your Zoom consultation is ready.</p>
                <a
                  href={appointment.zoomJoinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary underline underline-offset-4"
                >
                  Join Zoom meeting
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <p className="text-muted-foreground">Your online appointment is confirmed. Zoom link will appear here once created.</p>
            )}
          </div>
        ) : null}

        {!isHistory && appointment.status === "pending" ? (
          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="outline" className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => cancelAppointment(appointmentId)} disabled={cancelPending}>
              <TriangleAlert className="mr-2 h-4 w-4" />
              Cancel appointment
            </Button>
          </div>
        ) : null}

        {isHistory ? <AppointmentReviewForm appointment={appointment} {...reviewProps} /> : null}
      </div>
    </Card>
  );
}
