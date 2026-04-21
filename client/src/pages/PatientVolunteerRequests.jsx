import { useLocation } from "wouter";
import PatientVolunteerRequestFormCard from "@/features/volunteer-requests/patient/PatientVolunteerRequestFormCard";
import PatientVolunteerRequestsHeader from "@/features/volunteer-requests/patient/PatientVolunteerRequestsHeader";
import PatientVolunteerRequestsTabs from "@/features/volunteer-requests/patient/PatientVolunteerRequestsTabs";
import { usePatientVolunteerRequestsPage } from "@/features/volunteer-requests/patient/usePatientVolunteerRequestsPage";

export default function PatientVolunteerRequests() {
  const [, navigate] = useLocation();
  const page = usePatientVolunteerRequestsPage();

  return (
    <div className="app-page-shell">
      <div className="mx-auto max-w-5xl space-y-6">
        <PatientVolunteerRequestsHeader
          onBack={() => navigate("/dashboard/patient/services")}
          onNewRequest={() => page.setShowForm(true)}
          showForm={page.showForm}
        />

        {page.showForm ? (
          <PatientVolunteerRequestFormCard
            form={page.form}
            updateForm={page.updateForm}
            isLocating={page.isLocating}
            loading={page.createMutation.isPending}
            onCaptureLocation={page.captureLocation}
            onClose={() => page.setShowForm(false)}
            onSubmit={page.submitRequest}
          />
        ) : null}

        <PatientVolunteerRequestsTabs
          current={page.current}
          history={page.history}
          isLoading={page.isLoading}
          cancelPending={page.cancelMutation.isPending}
          ratePending={page.rateMutation.isPending}
          onCancel={page.cancelRequest}
          onRate={page.rateVolunteer}
        />
      </div>
    </div>
  );
}
