import { CalendarCheck } from "lucide-react";
import { useLocation } from "wouter";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { ProviderDashboardHeader, ProviderDashboardShell, ProviderHeaderAction } from "@/features/provider-dashboard/ProviderDashboardLayout";
import { DoctorDashboardTabs } from "./doctor-dashboard/DoctorDashboardTabs";
import { useDoctorDashboard } from "./doctor-dashboard/useDoctorDashboard";

export default function DoctorDashboard() {
  const [, navigate] = useLocation();
  const dashboard = useDoctorDashboard();

  if (dashboard.isLoading) {
    return <LoadingScreen className="min-h-[50vh]" />;
  }

  return (
    <ProviderDashboardShell>
      <ProviderDashboardHeader
        title={`Welcome back, Dr. ${dashboard.user?.name || "Doctor"}`}
        description="Manage emergency cases, track routes, and support patients in real time."
        actions={(
          <>
            <ProviderHeaderAction icon={CalendarCheck} onClick={() => navigate("/dashboard/doctor/appointments")}>Appointments</ProviderHeaderAction>
          </>
        )}
      />

      <DoctorDashboardTabs
        activeTab={dashboard.activeTab}
        setActiveTab={dashboard.setActiveTab}
        tabs={dashboard.tabs}
        availableCases={dashboard.availableCases}
        myCases={dashboard.myCases}
        resolvedCases={dashboard.resolvedCases}
        updateStatus={dashboard.updateStatus}
        onAccept={dashboard.handleAccept}
        onStatusUpdate={dashboard.handleStatusUpdate}
        onRatePatient={dashboard.handleSavePatientRating}
      />
    </ProviderDashboardShell>
  );
}
