import { z } from "zod";
import { requireAuth, sendZodError } from "../../../routes/helpers.js";
import { createAppointmentSchema } from "../appointment.schemas.js";
import { createAppointmentForPatient } from "../appointment.service.js";
import { appointmentErrorResponse, safeActivityLog } from "./appointmentRouteUtils.js";

export function registerAppointmentCreateRoutes(app) {
  app.post("/api/appointments", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "patient") return res.status(403).json({ message: "Only patients can book appointments" });
      const parsed = createAppointmentSchema.parse(req.body || {});
      const { appointment, doctor, patient, capturedPayment } = await createAppointmentForPatient(req, parsed);
      await safeActivityLog(req.session.userId, patient.name, "appointment_created", `Appointment booked with Dr. ${doctor.name} (${capturedPayment.payment.paymentRef})`, "appointment activity log");
      res.status(201).json(appointment);
    } catch (err) {
      if (err instanceof z.ZodError) return sendZodError(res, err);
      console.error("POST /api/appointments error:", err);
      const handled = appointmentErrorResponse(res, err, err.message || "Failed to create appointment");
      if (handled) return handled;
    }
  });
}
