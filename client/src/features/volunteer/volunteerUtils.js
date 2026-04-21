import { volunteerServiceOptions, volunteerUrgencyOptions } from "@shared/volunteer";

export const volunteerServices = volunteerServiceOptions;
export const volunteerUrgencies = volunteerUrgencyOptions;

export const volunteerStatusMeta = {
  pending: { label: "Pending", className: "border-orange-200 bg-orange-50 text-orange-700" },
  accepted: { label: "Accepted", className: "border-blue-200 bg-blue-50 text-blue-700" },
  in_progress: { label: "In Progress", className: "border-indigo-200 bg-indigo-50 text-indigo-700" },
  completed: { label: "Completed", className: "border-green-200 bg-green-50 text-green-700" },
  cancelled: { label: "Cancelled", className: "border-slate-200 bg-slate-50 text-slate-700" },
};

export function getVolunteerStatusMeta(status) {
  return volunteerStatusMeta[status] || volunteerStatusMeta.pending;
}

export function filterVolunteerRequests(items, { status = "all", serviceType = "all", urgency = "all", search = "", ownerId, mode }) {
  const query = search.trim().toLowerCase();

  return (items || []).filter((item) => {
    if (mode === "available" && item.status !== "pending") return false;
    if (mode === "active" && !["accepted", "in_progress"].includes(item.status)) return false;
    if (mode === "history" && !["completed", "cancelled"].includes(item.status)) return false;
    if (ownerId && mode !== "available" && String(item.volunteerId) !== String(ownerId)) return false;
    if (status !== "all" && item.status !== status) return false;
    if (serviceType !== "all" && item.serviceType !== serviceType) return false;
    if (urgency !== "all" && (item.urgency || "medium") !== urgency) return false;
    if (
      query &&
      ![item.patientName, item.patientPhone, item.address, item.locationNote, item.details, item.serviceType]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    ) {
      return false;
    }
    return true;
  });
}

export function sortVolunteerRequests(items, sortBy = "newest") {
  const urgencyRank = { high: 3, medium: 2, low: 1 };
  return [...(items || [])].sort((a, b) => {
    if (sortBy === "urgency") {
      return (urgencyRank[b.urgency || "medium"] || 0) - (urgencyRank[a.urgency || "medium"] || 0);
    }
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    if (sortBy === "oldest") return dateA - dateB;
    return dateB - dateA;
  });
}
