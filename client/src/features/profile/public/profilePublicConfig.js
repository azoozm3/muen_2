import { BriefcaseMedical, MapPin, Phone, ShieldPlus, Stethoscope, UserRound, Video } from "lucide-react";

export const publicProfileConfigByRole = {
  patient: {
    profileLabel: "Patient Profile",
    ratingText: "Provider rating",
    fallbackPath: "/dashboard/patient/services",
    nameFallback: "Patient",
    showProviderRatings: false,
    detailRows: [
      { icon: Phone, label: "Phone", getValue: (data) => data?.phone || "Not shared" },
      { icon: MapPin, label: "Address", getValue: (data) => data?.address || "Not shared" },
    ],
  },
  doctor: {
    profileLabel: "Doctor Profile",
    ratingText: "Patient rating",
    fallbackPath: "/dashboard/patient/services",
    nameFallback: "Doctor",
    showProviderRatings: true,
    ratingsTitle: "Patient Reviews",
    detailRows: [
      { icon: Stethoscope, label: "Specialty", getValue: (data) => data?.specialty || "Not shared" },
      { icon: BriefcaseMedical, label: "Experience", getValue: (data) => (data?.yearsOfExperience != null ? `${data.yearsOfExperience} year(s)` : "Not shared") },
      { icon: Phone, label: "Phone", getValue: (data) => data?.phone || "Not shared" },
      { icon: MapPin, label: "Address", getValue: (data) => data?.address || "Not shared" },
      { icon: ShieldPlus, label: "License", getValue: (data) => data?.licenseNumber || "Not shared" },
      { icon: Video, label: "Online Consultation", getValue: (data) => (data?.onlineConsultation ? "Available" : "Not available") },
    ],
  },
  nurse: {
    profileLabel: "Nurse Profile",
    ratingText: "Patient rating",
    fallbackPath: "/dashboard/patient/nurse-requests",
    nameFallback: "Nurse",
    showProviderRatings: true,
    ratingsTitle: "Patient Reviews",
    detailRows: [
      { icon: UserRound, label: "Role", getValue: () => "Nurse" },
      { icon: BriefcaseMedical, label: "Experience", getValue: (data) => (data?.yearsOfExperience != null ? `${data.yearsOfExperience} year(s)` : "Not shared") },
      { icon: Phone, label: "Phone", getValue: (data) => data?.phone || "Not shared" },
      { icon: MapPin, label: "Address", getValue: (data) => data?.address || "Not shared" },
      { icon: ShieldPlus, label: "License", getValue: (data) => data?.licenseNumber || "Not shared" },
      { icon: Stethoscope, label: "Specialty", getValue: (data) => data?.specialty || "Not shared" },
    ],
  },
  volunteer: {
    profileLabel: "Volunteer Profile",
    ratingText: "Patient rating",
    fallbackPath: "/dashboard/patient/volunteer-requests",
    nameFallback: "Volunteer",
    showProviderRatings: true,
    ratingsTitle: "Patient Reviews",
    detailRows: [
      { icon: UserRound, label: "Role", getValue: () => "Volunteer" },
      { icon: Phone, label: "Phone", getValue: (data) => data?.phone || "Not shared" },
      { icon: MapPin, label: "Address", getValue: (data) => data?.address || "Not shared" },
      { icon: Stethoscope, label: "Support Types", getValue: (data) => (Array.isArray(data?.volunteerSupportTypes) && data.volunteerSupportTypes.length ? data.volunteerSupportTypes.join(", ") : "Not shared") },
      { icon: BriefcaseMedical, label: "Availability", getValue: (data) => data?.volunteerAvailability || "Not shared" },
      { icon: ShieldPlus, label: "Transportation", getValue: (data) => (data?.volunteerHasTransportation ? "Available" : "Not shared") },
    ],
  },
  provider: {
    profileLabel: "Provider Profile",
    ratingText: "Patient rating",
    fallbackPath: "/dashboard/patient/services",
    nameFallback: "Provider",
    showProviderRatings: true,
    ratingsTitle: "Patient Reviews",
    detailRows: [
      { icon: Phone, label: "Phone", getValue: (data) => data?.phone || "Not shared" },
      { icon: MapPin, label: "Address", getValue: (data) => data?.address || "Not shared" },
    ],
  },
};

export function getPublicProfileConfig(role) {
  return publicProfileConfigByRole[role] || publicProfileConfigByRole.provider;
}

export function buildPublicProfileSummary(data) {
  const role = String(data?.role || "provider").toLowerCase();

  if (role === "patient") {
    return {
      ratingValue: data?.patientRating ?? null,
      ratingCount: Number(data?.patientRatingCount || 0),
    };
  }

  if (role === "nurse") {
    return {
      ratingValue: data?.providerRating ?? data?.patientRating ?? null,
      ratingCount: Number(data?.providerRatingCount ?? data?.patientRatingCount ?? (Array.isArray(data?.providerRatings) ? data.providerRatings.length : 0)),
    };
  }

  return {
    ratingValue: data?.providerRating ?? data?.rating ?? null,
    ratingCount: Number(data?.providerRatingCount ?? (Array.isArray(data?.providerRatings) ? data.providerRatings.length : 0)),
  };
}
