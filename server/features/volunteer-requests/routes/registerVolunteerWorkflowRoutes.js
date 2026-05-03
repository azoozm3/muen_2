import { z } from "zod";
import { requireAuth, sendZodError } from "../../../routes/helpers.js";
import { statusSchema } from "../volunteer-request.schemas.js";
import { findVolunteerRequestByAnyId, serializeVolunteerRequest } from "../volunteer-request.service.js";

export function registerVolunteerWorkflowRoutes(app, { storage }) {
  app.patch("/api/volunteer-requests/:id/accept", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "volunteer") return res.status(403).json({ message: "Only volunteers can accept requests" });
      const requestDoc = await findVolunteerRequestByAnyId(req.params.id);
      if (!requestDoc) return res.status(404).json({ message: "Volunteer request not found" });
      if (requestDoc.status !== "pending") return res.status(400).json({ message: "This request is no longer available" });

      const volunteer = await storage.getUserById(req.session.userId);
      requestDoc.status = "accepted";
      requestDoc.volunteerId = String(req.session.userId);
      requestDoc.volunteerName = volunteer?.name || req.session.userName || "Volunteer";
      requestDoc.volunteerPhone = volunteer?.phone || "";
      requestDoc.acceptedAt = new Date();
      await requestDoc.save();
      res.json(serializeVolunteerRequest(requestDoc));
    } catch (err) {
      console.error("PATCH /api/volunteer-requests/:id/accept error:", err);
      res.status(500).json({ message: err.message || "Failed to accept volunteer request" });
    }
  });

  app.patch("/api/volunteer-requests/:id/status", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "volunteer") return res.status(403).json({ message: "Only volunteers can update request status" });
      const { status } = statusSchema.parse(req.body || {});
      const requestDoc = await findVolunteerRequestByAnyId(req.params.id);
      if (!requestDoc) return res.status(404).json({ message: "Volunteer request not found" });
      if (String(requestDoc.volunteerId) !== String(req.session.userId)) return res.status(403).json({ message: "This request is assigned to another volunteer" });
      if (!["accepted", "in_progress"].includes(requestDoc.status)) return res.status(400).json({ message: "This request cannot be updated anymore" });

      requestDoc.status = status;
      if (status === "in_progress") requestDoc.inProgressAt = new Date();
      if (status === "completed") requestDoc.completedAt = new Date();
      await requestDoc.save();
      res.json(serializeVolunteerRequest(requestDoc));
    } catch (err) {
      if (err instanceof z.ZodError) return sendZodError(res, err);
      console.error("PATCH /api/volunteer-requests/:id/status error:", err);
      res.status(500).json({ message: err.message || "Failed to update volunteer request" });
    }
  });

  app.patch("/api/volunteer-requests/:id/cancel", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "patient") return res.status(403).json({ message: "Only patients can cancel volunteer requests" });
      const requestDoc = await findVolunteerRequestByAnyId(req.params.id);
      if (!requestDoc) return res.status(404).json({ message: "Volunteer request not found" });
      if (String(requestDoc.patientId) !== String(req.session.userId)) return res.status(403).json({ message: "You can only cancel your own volunteer requests" });
      if (["completed", "cancelled"].includes(requestDoc.status)) return res.status(400).json({ message: "This request cannot be cancelled" });
      requestDoc.status = "cancelled";
      requestDoc.cancelledAt = new Date();
      await requestDoc.save();
      res.json(serializeVolunteerRequest(requestDoc));
    } catch (err) {
      console.error("PATCH /api/volunteer-requests/:id/cancel error:", err);
      res.status(500).json({ message: err.message || "Failed to cancel volunteer request" });
    }
  });
}
