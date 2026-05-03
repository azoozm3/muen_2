import { requireAuth } from "../../../routes/helpers.js";
import { getAppointmentsForSession } from "../appointment.service.js";

export function registerAppointmentReadRoutes(app) {
  app.get("/api/appointments", requireAuth, async (req, res) => {
    try {
      res.json(await getAppointmentsForSession({ userId: req.session.userId, userRole: req.session.userRole }));
    } catch (err) {
      if (err?.message === "ACCESS_DENIED") return res.status(403).json({ message: "Access denied" });
      console.error("GET /api/appointments error:", err);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });
}
