import { HeartHandshake, Shield, Stethoscope, UserRound } from "lucide-react";
import { volunteerAvailabilityOptions, volunteerServiceOptions } from "@shared/volunteer";

export function mapMedicalHistoryRows(medicalHistory) {
  return Array.isArray(medicalHistory)
    ? medicalHistory.map((row) => ({
        id: row.id || row._id || crypto.randomUUID(),
        title: row.title || "",
        details: row.details || "",
        recordDate: row.recordDate || "",
      }))
    : [];
}

export function createProfileForm(profile) {
  return {
    name: profile?.name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    specialty: profile?.specialty || "",
    bio: profile?.bio || "",
    onlineConsultation: !!profile?.onlineConsultation,
    volunteerSupportTypes: Array.isArray(profile?.volunteerSupportTypes)
      ? profile.volunteerSupportTypes
      : [],
    volunteerAvailability: profile?.volunteerAvailability || "",
    volunteerHasTransportation: !!profile?.volunteerHasTransportation,
    volunteerCoverageArea: profile?.volunteerCoverageArea || "",
    volunteerNotes: profile?.volunteerNotes || "",
    medicalHistory: mapMedicalHistoryRows(profile?.medicalHistory),
  };
}

export function sanitizeProfilePayload(form) {
  return {
    name: form.name.trim(),
    phone: form.phone.trim() || null,
    address: form.address.trim() || null,
    specialty: form.specialty.trim() || null,
    bio: form.bio.trim() || null,
    onlineConsultation: !!form.onlineConsultation,
    volunteerSupportTypes: Array.isArray(form.volunteerSupportTypes) && form.volunteerSupportTypes.length
      ? form.volunteerSupportTypes
      : [],
    volunteerAvailability: form.volunteerAvailability || null,
    volunteerHasTransportation: !!form.volunteerHasTransportation,
    volunteerCoverageArea: form.volunteerCoverageArea.trim() || null,
    volunteerNotes: form.volunteerNotes.trim() || null,
    medicalHistory: Array.isArray(form.medicalHistory)
      ? form.medicalHistory
          .map((row) => ({
            title: row.title?.trim() || "",
            details: row.details?.trim() || "",
            recordDate: row.recordDate || "",
          }))
          .filter((row) => row.title || row.details || row.recordDate)
      : [],
  };
}

export function getIncompleteProfileItems(profile) {
  if (!profile) return [];

  const missing = [];
  if (!profile.phone) missing.push("phone number");
  if (!profile.address) missing.push("address");

  if (profile.role === "doctor") {
    if (!profile.specialty) missing.push("specialty");
    if (!profile.bio) missing.push("doctor bio");
  }

  if (profile.role === "nurse" && !profile.bio) {
    missing.push("nurse bio");
  }

  if (profile.role === "volunteer") {
    if (!Array.isArray(profile.volunteerSupportTypes) || !profile.volunteerSupportTypes.length) {
      missing.push("supported services");
    }
    if (!profile.volunteerAvailability) missing.push("availability");
  }

  return missing;
}

export function isProfileIncomplete(profile) {
  return getIncompleteProfileItems(profile).length > 0;
}

export { volunteerAvailabilityOptions, volunteerServiceOptions };


export function buildProfileUpdatePayload(_role, form) {
  return sanitizeProfilePayload(form);
}

export function getRoleIcon(role) {
  if (role === "doctor") return Stethoscope;
  if (role === "nurse") return Shield;
  if (role === "volunteer") return HeartHandshake;
  return UserRound;
}

export function getBackPath(role) {
  if (role === "doctor") return "/dashboard/doctor";
  if (role === "nurse") return "/dashboard/nurse";
  if (role === "volunteer") return "/dashboard/volunteer";
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/patient/services";
}
