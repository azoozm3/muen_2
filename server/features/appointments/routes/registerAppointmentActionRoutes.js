import { z } from "zod";
import { requireAuth, sendZodError } from "../../../routes/helpers.js";
import {
  appointmentCancelSchema,
  appointmentNotesSchema,
  appointmentResponseSchema,
  appointmentReviewSchema,
  appointmentStatusSchema,
} from "../appointment.schemas.js";
import { cleanPrescriptionItems } from "../appointment.helpers.js";
import {
  cancelAppointmentForPatient,
  completeAppointmentForDoctor,
  respondToAppointment,
  saveAppointmentNotes,
  submitAppointmentReview,
} from "../appointment.service.js";
import { appointmentErrorResponse, safeActivityLog } from "./appointmentRouteUtils.js";

export function registerAppointmentActionRoutes(app) {
  app.patch("/api/appointments/:id/respond", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "doctor") return res.status(403).json({ message: "Only doctors can respond to appointments" });
      const parsed = appointmentResponseSchema.parse(req.body || {});
      const { appointment, updated } = await respondToAppointment({ appointmentId: req.params.id, doctorId: req.session.userId, action: parsed.action });
      await safeActivityLog(req.session.userId, appointment.doctorName, `appointment_${parsed.action}`, `Appointment ${parsed.action} for ${appointment.patientName}`, "appointment response log");
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) return sendZodError(res, err);
      console.error("PATCH /api/appointments/:id/respond error:", err);
      const handled = appointmentErrorResponse(res, err, err.message || "Failed to update appointment");
      if (handled) return handled;
    }
  });

  app.patch("/api/appointments/:id/cancel", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "patient") return res.status(403).json({ message: "Only the patient can cancel this appointment" });
      const parsed = appointmentCancelSchema.parse(req.body || {});
      res.json(await cancelAppointmentForPatient({ appointmentId: req.params.id, patientId: req.session.userId, reason: parsed.reason }));
    } catch (err) {
      if (err instanceof z.ZodError) return sendZodError(res, err);
      console.error("PATCH /api/appointments/:id/cancel error:", err);
      const handled = appointmentErrorResponse(res, err, "Failed to cancel appointment");
      if (handled) return handled;
    }
  });

  app.patch("/api/appointments/:id/status", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "doctor") return res.status(403).json({ message: "Only doctors can update appointment status" });
      const parsed = appointmentStatusSchema.parse(req.body || {});
      const { updated } = await completeAppointmentForDoctor({ appointmentId: req.params.id, doctorId: req.session.userId, status: parsed.status });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) return sendZodError(res, err);
      console.error("PATCH /api/appointments/:id/status error:", err);
      const handled = appointmentErrorResponse(res, err, "Failed to update appointment status");
      if (handled) return handled;
    }
  });

  app.patch("/api/appointments/:id/notes", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "doctor") return res.status(403).json({ message: "Only doctors can update appointment notes" });
      const parsed = appointmentNotesSchema.parse(req.body || {});
      const { appointment, updated } = await saveAppointmentNotes({ appointmentId: req.params.id, doctorId: req.session.userId, consultationSummary: parsed.consultationSummary, prescription: cleanPrescriptionItems(parsed.prescription) });
      await safeActivityLog(req.session.userId, appointment.doctorName, "appointment_notes_updated", `Consultation summary updated for ${appointment.patientName}`, "appointment notes log");
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) return sendZodError(res, err);
      console.error("PATCH /api/appointments/:id/notes error:", err);
      const handled = appointmentErrorResponse(res, err, "Failed to save appointment notes");
      if (handled) return handled;
    }
  });

  app.post("/api/appointments/:id/review", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "patient") return res.status(403).json({ message: "Only patients can submit appointment reviews" });
      const parsed = appointmentReviewSchema.parse(req.body || {});
      const { appointment, patient, review } = await submitAppointmentReview({ appointmentId: req.params.id, patientId: req.session.userId, rating: parsed.rating, comment: parsed.comment });
      await safeActivityLog(req.session.userId, patient?.name || appointment.patientName, "appointment_review_added", `Review added for Dr. ${appointment.doctorName}`, "appointment review log");
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) return sendZodError(res, err);
      console.error("POST /api/appointments/:id/review error:", err);
      const handled = appointmentErrorResponse(res, err, "Failed to submit review");
      if (handled) return handled;
    }
  });
}
