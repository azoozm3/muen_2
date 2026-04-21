import { safeNumber } from "../utils.js";
import { toObjectIdString } from "./sharedMapperUtils.js";

export function mapUser(user) {
  return {
    id: toObjectIdString(user?._id),
    name: user?.name || "Unknown",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "patient",
    active: Boolean(user?.active),
    createdAt: user?.createdAt || null,
    specialty: user?.specialty || "",
    location: user?.location || "",
    onlineConsultation: Boolean(user?.onlineConsultation),
    rating: safeNumber(user?.rating),
    reviewsCount: safeNumber(user?.reviewsCount),
  };
}
