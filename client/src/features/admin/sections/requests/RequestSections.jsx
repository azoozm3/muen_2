import { AdminRequestsView } from "@/features/admin/sections/requests/shared/AdminRequestsView";
import {
  appointmentRequestsConfig,
  emergencyRequestsConfig,
  nurseRequestsConfig,
  volunteerRequestsConfig,
} from "@/features/admin/sections/requests/requestViewConfigs";

function renderRequestSection(config, summary, rows) {
  return (
    <AdminRequestsView
      {...config}
      summary={summary}
      rows={rows}
      extraSummaryStats={typeof config.extraSummaryStats === "function" ? config.extraSummaryStats(summary) : config.extraSummaryStats}
    />
  );
}

export function RequestsSection({ data, appointmentsData }) {
  return (
    <div className="space-y-8">
      <EmergencyRequestsSection data={data} />
      <NurseRequestsSection data={data} />
      <VolunteerRequestsSection data={data} />
      {appointmentsData ? <AppointmentRequestsSection data={appointmentsData} /> : null}
    </div>
  );
}

export function EmergencyRequestsSection({ data }) {
  return renderRequestSection(emergencyRequestsConfig, data?.summary?.emergency, data?.emergencyRequests || []);
}

export function NurseRequestsSection({ data }) {
  return renderRequestSection(nurseRequestsConfig, data?.summary?.nurse, data?.nurseRequests || []);
}

export function VolunteerRequestsSection({ data }) {
  return renderRequestSection(volunteerRequestsConfig, data?.summary?.volunteer, data?.volunteerRequests || []);
}

export function AppointmentRequestsSection({ data }) {
  return renderRequestSection(appointmentRequestsConfig, data?.summary, data?.appointments || []);
}
