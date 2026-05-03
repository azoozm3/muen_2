import storage from "../../../storage/index.js";
import { consumeCapturedPayment } from "../../../routes/payment.routes.js";
import { refundCapturedPayment } from "../../../services/payment-refund.service.js";
import { createZoomMeeting } from "../../../services/zoom/zoom.service.js";
import { buildAppointmentStartTime } from "../appointment.helpers.js";
import { getDoctorOwnedAppointment, getPatientOwnedAppointment } from "./appointmentAccess.js";

export async function createAppointmentForPatient(req, payload) {
  const patient = await storage.getUserById(req.session.userId);
  if (!patient) throw new Error("PATIENT_NOT_FOUND");

  const doctor = await storage.getUserById(payload.doctorId);
  if (!doctor || doctor.role !== "doctor") throw new Error("DOCTOR_NOT_FOUND");
  if (payload.appointmentType === "online" && !doctor.onlineConsultation) throw new Error("ONLINE_NOT_AVAILABLE");

  const capturedPayment = consumeCapturedPayment(req, payload.paymentOrderId, "appointment");
  const appointment = await storage.createAppointment({
    patientId: String(req.session.userId),
    doctorId: String(payload.doctorId),
    patientName: patient.name,
    patientPhone: patient.phone || "",
    doctorName: doctor.name,
    specialty: doctor.specialty || "",
    date: payload.date,
    time: payload.time,
    reason: payload.reason,
    appointmentType: payload.appointmentType,
    pricingSnapshot: capturedPayment.pricing,
    payment: { ...capturedPayment.payment },
  });

  return { appointment, doctor, patient, capturedPayment };
}

export async function refundAppointmentPayment(appointment, reason) {
  return refundCapturedPayment(appointment, { reason: reason || "Refunded", note: reason || "Appointment refund" });
}

export async function attachZoomMeetingToAppointment(appointment) {
  if (!appointment || appointment.appointmentType !== "online" || appointment.zoomJoinUrl) return appointment;

  const zoomMeeting = await createZoomMeeting({
    topic: `Mu'en Appointment - ${appointment.patientName} with Dr. ${appointment.doctorName}`,
    startTime: buildAppointmentStartTime(appointment.date, appointment.time),
    duration: 30,
  });

  if (zoomMeeting.skipped) return appointment;
  return storage.saveAppointmentZoomMeeting(appointment.id || appointment._id, zoomMeeting);
}

export async function respondToAppointment({ appointmentId, doctorId, action }) {
  const appointment = await getDoctorOwnedAppointment(appointmentId, doctorId);
  if (appointment.status !== "pending") throw new Error("ALREADY_HANDLED");

  let updated = await storage.updateAppointmentStatus(appointmentId, action);
  if (action === "confirmed") updated = await attachZoomMeetingToAppointment(updated);
  if (action === "rejected") await refundAppointmentPayment(updated, "Appointment rejected by doctor");
  return { appointment, updated };
}

export async function cancelAppointmentForPatient({ appointmentId, patientId, reason }) {
  const appointment = await getPatientOwnedAppointment(appointmentId, patientId);
  if (["completed", "cancelled"].includes(appointment.status)) throw new Error("CANNOT_CANCEL");
  const updated = await storage.updateAppointmentStatus(appointmentId, "cancelled");
  await refundAppointmentPayment(updated, reason || "Appointment cancelled by patient");
  return updated;
}

export async function completeAppointmentForDoctor({ appointmentId, doctorId, status }) {
  const appointment = await getDoctorOwnedAppointment(appointmentId, doctorId);
  if (!["confirmed", "completed"].includes(appointment.status)) throw new Error("NOT_CONFIRMABLE");
  return { appointment, updated: appointment.status === "completed" ? appointment : await storage.updateAppointmentStatus(appointmentId, status) };
}

export async function saveAppointmentNotes({ appointmentId, doctorId, consultationSummary, prescription }) {
  const appointment = await getDoctorOwnedAppointment(appointmentId, doctorId);
  const updated = await storage.updateAppointmentNotes(appointmentId, consultationSummary, prescription);
  return { appointment, updated };
}

export async function submitAppointmentReview({ appointmentId, patientId, rating, comment }) {
  const appointment = await getPatientOwnedAppointment(appointmentId, patientId);
  if (appointment.status !== "completed") throw new Error("REVIEW_TOO_EARLY");
  if (appointment.reviewSubmitted) throw new Error("REVIEW_EXISTS");

  const patient = await storage.getUserById(patientId);
  const review = await storage.createReview({ doctorId: appointment.doctorId, patientId: String(patientId), patientName: patient?.name || appointment.patientName, rating, comment });
  await storage.markAppointmentReviewSubmitted(appointmentId);
  await storage.updateDoctorRating(appointment.doctorId);
  return { appointment, patient, review };
}
