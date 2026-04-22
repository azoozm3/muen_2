import { useMemo } from "react";
import { UserCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { usePatientAppointments } from "@/hooks/use-appointments";
import PatientAppointmentCard from "@/features/appointments/patient/PatientAppointmentCard";
import AppointmentsPageLayout from "@/features/appointments/shared/AppointmentsPageLayout";
import { APPOINTMENT_HISTORY_STATUSES } from "@/features/appointments/shared/appointmentStatusSets";
import { usePatientAppointmentActions } from "@/features/appointments/patient/usePatientAppointmentActions";

export default function PatientAppointments() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: appointments = [], isLoading } = usePatientAppointments();
  const { reviewProps, cancelMutation, reviewMutation } = usePatientAppointmentActions();

  const currentAppointments = useMemo(() => appointments.filter((item) => !APPOINTMENT_HISTORY_STATUSES.has(item.status)), [appointments]);
  const historyAppointments = useMemo(() => appointments.filter((item) => APPOINTMENT_HISTORY_STATUSES.has(item.status)), [appointments]);

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
    <AppointmentsPageLayout
      title="Appointments"
      description="Track your booked visits."
      userLabel={user?.name || ""}
      onProfileClick={() => navigate("/profile")}
      ProfileIcon={UserCircle}
      isLoading={isLoading}
      current={{
        title: "Current appointments",
        description: "Upcoming visits and requests you can still manage.",
        emptyText: "No current appointments.",
        items: currentAppointments,
        renderItem: (appointment) => renderCard(appointment),
      }}
      history={{
        title: "History",
        description: "See completed visits, prescriptions, consultation summaries, and doctor reviews.",
        emptyText: "No appointment history yet.",
        items: historyAppointments,
        renderItem: (appointment) => renderCard(appointment, true),
      }}
    />
  );
}
