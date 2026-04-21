import { volunteerServices } from "@/features/volunteer/volunteerUtils";

const ACTIVE_STATUSES = new Set(["pending", "accepted", "in_progress"]);
const HISTORY_STATUSES = new Set(["completed", "cancelled"]);

export const INITIAL_VOLUNTEER_REQUEST_FORM = {
  patientName: "",
  patientPhone: "",
  serviceType: volunteerServices[0],
  urgency: "medium",
  address: "",
  latitude: null,
  longitude: null,
  locationNote: "",
  details: "",
};

export function applyUserDefaults(form, user) {
  return {
    ...form,
    patientName: form.patientName || user?.name || "",
    patientPhone: form.patientPhone || user?.phone || "",
  };
}

export function splitVolunteerRequests(items = []) {
  return {
    current: items.filter((item) => ACTIVE_STATUSES.has(item.status)),
    history: items.filter((item) => HISTORY_STATUSES.has(item.status)),
  };
}
