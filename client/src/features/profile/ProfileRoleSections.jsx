import {
  AdminDetailsSection,
  DoctorDetailsSection,
  NurseDetailsSection,
  PatientDetailsSection,
  PatientRatingSummarySection,
  PersonalInfoSection,
  ReviewsSection,
  VolunteerInfoSection,
} from "./ProfileSections";
import { PatientPrivateTimelineSection } from "./PatientPrivateTimelineSection";

export function ProfileRoleSections({
  formData,
  isEditing,
  privateAppointments,
  privateEmergencyRequests,
  privateNurseRequests,
  profile,
  setFormData,
  userRole,
  volunteerRequests,
}) {
  return (
    <div className="space-y-4">
      <PersonalInfoSection isEditing={isEditing} profile={profile} formData={formData} setFormData={setFormData} />
      {userRole === "patient" ? <PatientDetailsSection isEditing={isEditing} profile={profile} formData={formData} setFormData={setFormData} /> : null}
      {userRole === "patient" ? <PatientRatingSummarySection profile={profile} /> : null}
      {userRole === "doctor" ? <DoctorDetailsSection isEditing={isEditing} profile={profile} formData={formData} setFormData={setFormData} /> : null}
      {userRole === "nurse" ? <NurseDetailsSection isEditing={isEditing} profile={profile} formData={formData} setFormData={setFormData} /> : null}
      {userRole === "admin" ? <AdminDetailsSection profile={profile} /> : null}
      {["doctor", "nurse", "volunteer"].includes(userRole) ? <ReviewsSection reviews={profile?.providerRatings || []} /> : null}
      {userRole === "volunteer" ? <VolunteerInfoSection isEditing={isEditing} profile={profile} formData={formData} setFormData={setFormData} /> : null}
      {userRole === "patient" ? (
        <PatientPrivateTimelineSection
          medicalHistory={profile?.medicalHistory || []}
          appointments={privateAppointments}
          emergencyRequests={privateEmergencyRequests}
          nurseRequests={privateNurseRequests}
          volunteerRequests={volunteerRequests}
        />
      ) : null}
    </div>
  );
}
