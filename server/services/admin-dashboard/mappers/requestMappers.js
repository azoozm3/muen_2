import { safeNumber } from "../adminDashboardUtils.js";
import { paymentSnapshot } from "./paymentMapper.js";
import { toObjectIdString, toTextId } from "./sharedMapperUtils.js";

export function mapEmergencyRequest(item) {
  return {
    id: toObjectIdString(item?._id),
    publicRequestId: item?.publicCaseId || "",
    publicCaseId: item?.publicCaseId || "",
    requestNumber: safeNumber(item?.caseNumber, null),
    patientId: toTextId(item?.patientId),
    patientName: item?.name || "Unknown",
    patientPhone: item?.patientPhone || "",
    location: item?.location || "",
    address: item?.location || "",
    latitude: item?.latitude ?? null,
    longitude: item?.longitude ?? null,
    emergencyType: item?.emergencyType || "Emergency Help",
    reason: item?.description || "",
    description: item?.description || "",
    status: item?.status || "pending",
    createdAt: item?.createdAt || null,
    providerId: toTextId(item?.primaryResponderId || item?.acceptedBy),
    providerName: item?.primaryResponderName || item?.acceptedByName || "",
    responderName: item?.primaryResponderName || item?.acceptedByName || "",
    providerType: "doctor",
    responderRole: item?.primaryResponderRole || "doctor",
  };
}

export function mapVolunteerRequest(item) {
  return {
    id: toObjectIdString(item?._id),
    publicRequestId: item?.publicRequestId || "",
    requestNumber: safeNumber(item?.requestNumber, null),
    patientId: item?.patientId || "",
    patientName: item?.patientName || "Unknown",
    patientPhone: item?.patientPhone || "",
    address: item?.address || item?.location || "",
    location: item?.address || item?.location || "",
    latitude: item?.latitude ?? null,
    longitude: item?.longitude ?? null,
    locationNote: item?.locationNote || "",
    serviceType: item?.serviceType || "",
    details: item?.details || "",
    description: item?.details || "",
    status: item?.status || "pending",
    createdAt: item?.createdAt || null,
    providerId: item?.volunteerId || "",
    providerName: item?.volunteerName || "",
    providerType: "volunteer",
  };
}

export function mapNurseRequest(item) {
  return {
    id: toObjectIdString(item?._id),
    publicRequestId: item?.publicRequestId || "",
    requestNumber: safeNumber(item?.requestNumber, null),
    patientId: item?.patientId || "",
    patientName: item?.patientName || "Unknown",
    patientPhone: item?.patientPhone || "",
    providerId: item?.nurseId || "",
    providerName: item?.nurseName || "",
    providerType: "nurse",
    serviceType: item?.serviceType || "Nurse Request",
    status: item?.status || "pending",
    location: item?.address || item?.location || "",
    address: item?.address || item?.location || "",
    locationNote: item?.locationNote || "",
    locationLat: item?.locationLat || "",
    locationLng: item?.locationLng || "",
    requestedDate: item?.requestedDate || "",
    requestedTime: item?.requestedTime || "",
    notes: item?.note || item?.notes || "",
    createdAt: item?.createdAt || null,
    payment: paymentSnapshot(item),
  };
}
