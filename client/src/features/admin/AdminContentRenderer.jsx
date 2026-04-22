import { DashboardSection } from "./sections/DashboardSection";
import { UsersSection } from "./sections/UsersSection";
import {
  EmergencyRequestsSection,
  NurseRequestsSection,
  RequestsSection,
  VolunteerRequestsSection,
} from "./sections/requests/RequestSections";
import { AppointmentsSection } from "./sections/AppointmentsSection";
import { PaymentsSection } from "./sections/PaymentsSection";
import { AnalyticsSection } from "./sections/AnalyticsSection";
import { SettingsSection } from "./sections/SettingsSection";
import { VolunteersSection } from "./sections/VolunteersSection";

function renderUsersSection(title, subtitle, data, mutationState, onToggleActive, onDelete) {
  return (
    <UsersSection
      title={title}
      subtitle={subtitle}
      data={data}
      mutationState={mutationState}
      onToggleActive={onToggleActive}
      onDelete={onDelete}
    />
  );
}

export function AdminContentRenderer(section, context) {
  const {
    appointmentsQuery,
    dashboardQuery,
    deleteUserMutation,
    paymentsQuery,
    requestsQuery,
    settingsQuery,
    updateSettingsMutation,
    updateUserMutation,
    usersQuery,
    analyticsQuery,
    handleDelete,
    handleSaveSettings,
    handleToggleActive,
  } = context;
  const userMutationState = updateUserMutation.isPending || deleteUserMutation.isPending;

  switch (section) {
    case "users":
      return renderUsersSection("Users", "All users.", usersQuery.data, userMutationState, handleToggleActive, handleDelete);
    case "doctors":
      return renderUsersSection("Doctors", "Doctor accounts.", usersQuery.data, userMutationState, handleToggleActive, handleDelete);
    case "nurses":
      return renderUsersSection("Nurses", "Nurse accounts.", usersQuery.data, userMutationState, handleToggleActive, handleDelete);
    case "patients":
      return renderUsersSection("Patients", "Patient accounts.", usersQuery.data, userMutationState, handleToggleActive, handleDelete);
    case "volunteers":
      return (
        <VolunteersSection
          usersData={usersQuery.data}
          requestsData={requestsQuery.data}
          mutationState={userMutationState}
          onToggleActive={handleToggleActive}
          onDelete={handleDelete}
        />
      );
    case "requests":
      return <RequestsSection data={requestsQuery.data} appointmentsData={appointmentsQuery.data} />;
    case "emergency-requests":
      return <EmergencyRequestsSection data={requestsQuery.data} />;
    case "nurse-requests":
      return <NurseRequestsSection data={requestsQuery.data} />;
    case "volunteer-requests":
      return <VolunteerRequestsSection data={requestsQuery.data} />;
    case "appointments":
      return <AppointmentsSection data={appointmentsQuery.data} />;
    case "payments":
      return <PaymentsSection data={paymentsQuery.data} />;
    case "analytics":
      return <AnalyticsSection data={analyticsQuery.data} />;
    case "settings":
      return <SettingsSection data={settingsQuery.data} onSave={handleSaveSettings} isSaving={updateSettingsMutation.isPending} />;
    default:
      return <DashboardSection data={dashboardQuery.data} />;
  }
}
