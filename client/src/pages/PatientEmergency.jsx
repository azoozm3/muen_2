import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateStatus } from "@/hooks/use-emergency-requests";
import { useToast } from "@/hooks/use-toast";
import { PatientStatusCard } from "@/components/patient/PatientStatusCard";
import { PatientEmergencyForm } from "@/components/patient/PatientEmergencyForm";
import { usePatientEmergency } from "@/components/patient/usePatientEmergency";

export default function PatientEmergency() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const initialRequestId = new URLSearchParams(searchString).get("requestId");
  const { toast } = useToast();
  const updateStatus = useUpdateStatus();
  const patientEmergency = usePatientEmergency({ user, initialRequestId, toast });

  if (patientEmergency.activeRequestId && patientEmergency.request) {
    return (
      <PatientStatusCard
        request={patientEmergency.request}
        navigate={navigate}
        updateStatus={updateStatus}
        setActiveRequestId={patientEmergency.setActiveRequestId}
      />
    );
  }

  return (
    <PatientEmergencyForm
      form={patientEmergency.form}
      geoState={patientEmergency.geoState}
      hasGpsCoordinates={patientEmergency.hasGpsCoordinates}
      createRequest={patientEmergency.createRequest}
      navigate={navigate}
      onSubmit={patientEmergency.submitEmergency}
    />
  );
}
