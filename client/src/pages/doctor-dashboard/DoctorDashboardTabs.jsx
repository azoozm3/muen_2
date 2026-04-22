import { DoctorCaseGrid, AvailableCaseCard, MyCaseCard, ResolvedCasesCard, availableEmptyState, myCasesEmptyState } from "@/components/doctor/DoctorCards";
import { ProviderDashboardTabPanel, ProviderDashboardTabs } from "@/features/provider-dashboard/ProviderDashboardLayout";

export function DoctorDashboardTabs({ activeTab, setActiveTab, tabs, availableCases, myCases, resolvedCases, updateStatus, onAccept, onStatusUpdate, onRatePatient }) {
  return (
    <ProviderDashboardTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      <ProviderDashboardTabPanel value="available" className="space-y-6">
        <DoctorCaseGrid
          cases={availableCases}
          emptyState={availableEmptyState}
          renderCard={(request) => <AvailableCaseCard key={request.id || request._id} request={request} onAccept={onAccept} isUpdating={updateStatus.isPending} />}
        />
      </ProviderDashboardTabPanel>

      <ProviderDashboardTabPanel value="my-cases" className="space-y-6">
        <DoctorCaseGrid
          cases={myCases}
          emptyState={myCasesEmptyState}
          columns="md:grid-cols-2"
          renderCard={(request) => <MyCaseCard key={request.id || request._id} request={request} onStatusUpdate={onStatusUpdate} isUpdating={updateStatus.isPending} />}
        />
      </ProviderDashboardTabPanel>

      <ProviderDashboardTabPanel value="resolved">
        <ResolvedCasesCard cases={resolvedCases} onRatePatient={onRatePatient} />
      </ProviderDashboardTabPanel>
    </ProviderDashboardTabs>
  );
}
