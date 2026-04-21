import { safeNumber } from "../utils.js";
import { paymentSnapshot } from "./paymentMapper.js";
import { toObjectIdString } from "./sharedMapperUtils.js";

export function mapAppointment(item) {
  const appointmentNumber = safeNumber(item?.appointmentNumber, null);
  const publicAppointmentId = appointmentNumber ? `APP-${String(appointmentNumber).padStart(4, "0")}` : "";

  return {
    id: toObjectIdString(item?._id),
    publicRequestId: publicAppointmentId,
    publicAppointmentId,
    requestNumber: appointmentNumber,
    patientId: item?.patientId || "",
    patientName: item?.patientName || "Unknown",
    patientPhone: item?.patientPhone || "",
    providerId: item?.doctorId || "",
    doctorId: item?.doctorId || "",
    providerName: item?.doctorName || "",
    doctorName: item?.doctorName || "",
    providerType: "doctor",
    specialty: item?.specialty || "",
    status: item?.status || "pending",
    appointmentType: item?.appointmentType || "in_person",
    date: item?.date || "",
    time: item?.time || "",
    reason: item?.reason || "",
    createdAt: item?.createdAt || null,
    payment: paymentSnapshot(item),
  };
}
