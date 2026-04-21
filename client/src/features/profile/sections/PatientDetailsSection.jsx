import { FileText } from "lucide-react";
import HealthRecordEditor from "@/features/health-record/HealthRecordEditor";
import HealthRecordList from "@/features/health-record/HealthRecordList";
import { ProfileSectionCard } from "./common";

export function PatientDetailsSection({ isEditing, profile, formData, setFormData }) {
  return (
    <ProfileSectionCard icon={FileText} title="Medical History">
      {isEditing ? (
        <HealthRecordEditor value={formData.medicalHistory} onChange={(rows) => setFormData((prev) => ({ ...prev, medicalHistory: rows }))} />
      ) : (
        <HealthRecordList rows={profile?.medicalHistory} emptyText="No medical history recorded. Click Edit to add your information." />
      )}
    </ProfileSectionCard>
  );
}
