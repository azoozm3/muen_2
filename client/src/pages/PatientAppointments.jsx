import { useMemo } from "react";
import { UserCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { usePatientAppointments } from "@/hooks/use-appointments";
import PatientAppointmentCard from "@/features/appointments/patient/PatientAppointmentCard";
import AppointmentsHeader from "@/features/appointments/shared/AppointmentsHeader";
import AppointmentsSection from "@/features/appointments/shared/AppointmentsSection";
import { usePatientAppointmentActions } from "@/features/appointments/patient/usePatientAppointmentActions";

const HISTORY_STATUSES = new Set(["completed", "cancelled", "rejected"]);

export default function PatientAppointments() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: appointments = [], isLoading } = usePatientAppointments();
  const { reviewProps, cancelMutation, reviewMutation } = usePatientAppointmentActions();

  const currentAppointments = useMemo(() => appointments.filter((item) => !HISTORY_STATUSES.has(item.status)), [appointments]);
  const historyAppointments = useMemo(() => appointments.filter((item) => HISTORY_STATUSES.has(item.status)), [appointments]);

  const submitReview = (appointmentId, payload) => {
    reviewMutation.mutate({ appointmentId, payload });
  };

  const cardReviewProps = { ...reviewProps, submitReview };
  const renderCard = (appointment, isHistory = false) => (
    <PatientAppointmentCard
      key={appointment.id || appointment._id}
      appointment={appointment}
      isHistory={isHistory}
      cancelAppointment={(id) => cancelMutation.mutate(id)}
      cancelPending={cancelMutation.isPending}
      reviewProps={cardReviewProps}
    />
  );

  return (
    <div className="app-page-shell">
      <div className="app-page-container max-w-6xl">
        <AppointmentsHeader
          title="Appointments"
          description="Track your booked visits."
          userLabel={user?.name || ""}
          onProfileClick={() => navigate("/profile")}
          ProfileIcon={UserCircle}
        />

        {isLoading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-8">
            <AppointmentsSection
              title="Current appointments"
              description="Upcoming visits and requests you can still manage."
              emptyText="No current appointments."
              items={currentAppointments}
              renderItem={(appointment) => renderCard(appointment)}
            />
            <AppointmentsSection
              title="History"
              description="See completed visits, prescriptions, consultation summaries, and doctor reviews."
              emptyText="No appointment history yet."
              items={historyAppointments}
              renderItem={(appointment) => renderCard(appointment, true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
