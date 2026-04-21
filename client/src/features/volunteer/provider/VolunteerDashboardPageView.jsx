import { HeartHandshake, UserCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ProviderDashboardHeader, ProviderDashboardShell, ProviderDashboardTabPanel, ProviderDashboardTabs, ProviderHeaderAction, ProviderInfoBanner } from "@/features/provider-dashboard/ProviderDashboardLayout";
import { ActiveVolunteerRequestsTab, AvailableVolunteerRequestsTab, VolunteerHistoryTab } from "@/features/volunteer/provider/VolunteerDashboardSections";
import { useVolunteerDashboardPage } from "@/features/volunteer/provider/useVolunteerDashboardPage";

export default function VolunteerDashboardPageView() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const dashboard = useVolunteerDashboardPage(user?.id);
  const tabs = [
    { value: "available", label: "Available", count: dashboard.available.length },
    { value: "active", label: "My Active", count: dashboard.active.length },
    { value: "history", label: "History", count: dashboard.history.length },
  ];

  return (
    <ProviderDashboardShell>
      <ProviderDashboardHeader title="Volunteer Dashboard" description={`Welcome, ${user?.name}. Review open requests, manage your active support tasks, and track history.`} />
      <ProviderDashboardTabs defaultValue="available" tabs={tabs}>
        <ProviderDashboardTabPanel value="available"><AvailableVolunteerRequestsTab isLoading={dashboard.isLoading} items={dashboard.available} isPending={dashboard.acceptPending} onAccept={dashboard.acceptRequest} /></ProviderDashboardTabPanel>
        <ProviderDashboardTabPanel value="active"><ActiveVolunteerRequestsTab items={dashboard.active} isPending={dashboard.statusPending} onStart={(id) => dashboard.updateStatus(id, "in_progress")} onComplete={(id) => dashboard.updateStatus(id, "completed")} /></ProviderDashboardTabPanel>
        <ProviderDashboardTabPanel value="history"><VolunteerHistoryTab items={dashboard.history} isPending={dashboard.ratePending} onRatePatient={dashboard.ratePatient} /></ProviderDashboardTabPanel>
      </ProviderDashboardTabs>
    </ProviderDashboardShell>
  );
}
