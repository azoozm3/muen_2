import { useMemo } from "react";
import { UserCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useDoctorAppointments } from "@/hooks/use-appointments";
import DoctorAppointmentCard from "@/features/appointments/doctor/DoctorAppointmentCard";
import AppointmentsPageLayout from "@/features/appointments/shared/AppointmentsPageLayout";
import { APPOINTMENT_HISTORY_STATUSES } from "@/features/appointments/shared/appointmentStatusSets";
import { useDoctorAppointmentActions } from "@/features/appointments/doctor/useDoctorAppointmentActions";

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: appointments = [], isLoading } = useDoctorAppointments();
  const actions = useDoctorAppointmentActions();

  const currentAppointments = useMemo(() => appointments.filter((item) => !APPOINTMENT_HISTORY_STATUSES.has(item.status)), [appointments]);
  const historyAppointments = useMemo(() => appointments.filter((item) => APPOINTMENT_HISTORY_STATUSES.has(item.status)), [appointments]);
  const updatePending = actions.respondMutation.isPending || actions.completeMutation.isPending;

  const handleStatusChange = (appointment, nextStatus) => {
    const id = appointment.id || appointment._id;
    if (!id) return;
    if (["confirmed", "rejected"].includes(nextStatus)) return actions.respondMutation.mutate({ id, action: nextStatus });
    if (nextStatus === "completed") actions.completeMutation.mutate({ id });
  };

  const saveDetails = (appointmentId) => actions.saveDetailsMutation.mutate({
    id: appointmentId,
    consultationSummary: actions.detailsState.summaryText[appointmentId] ?? "",
    prescription: actions.detailsState.prescriptionRows[appointmentId] ?? [],
  });

  const renderCard = (appointment, isHistory = false) => (
    <DoctorAppointmentCard
      key={appointment.id || appointment._id}
      appointment={appointment}
      isHistory={isHistory}
      handleStatusChange={handleStatusChange}
      updatePending={updatePending}
      detailsState={actions.detailsState}
      saveDetails={saveDetails}
      saveDetailsPending={actions.saveDetailsMutation.isPending}
      ratePatientMutation={actions.ratePatientMutation}
    />
  );

  return (
    <AppointmentsPageLayout
      title="Appointments"
      description="Review and manage your schedule."
      userLabel={`Dr. ${user?.name || ""}`}
      onProfileClick={() => navigate("/profile")}
      ProfileIcon={UserCircle}
      isLoading={isLoading}
      current={{
        title: "Current appointments",
        description: "Pending and confirmed appointments with available actions.",
        emptyText: "No current appointments.",
        items: currentAppointments,
        renderItem: (appointment) => renderCard(appointment),
      }}
      history={{
        title: "History",
        description: "Completed, cancelled, and rejected appointments.",
        emptyText: "No appointment history yet.",
        items: historyAppointments,
        renderItem: (appointment) => renderCard(appointment, true),
      }}
    />
  );
}
