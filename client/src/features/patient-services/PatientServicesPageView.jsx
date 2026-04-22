import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { PatientServicesHeader, FindDoctorCard, PatientServiceGrid } from "@/features/patient-services/PatientServicesSection";
import { patientServices } from "@/features/patient-services/patientServiceCards";

export default function PatientServicesPageView() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <PatientServicesHeader name={user?.name || "Friend"} />
        <FindDoctorCard onClick={() => navigate("/dashboard/patient/doctors")} />
        <PatientServiceGrid items={patientServices} onOpen={navigate} />
      </div>
    </div>
  );
}
