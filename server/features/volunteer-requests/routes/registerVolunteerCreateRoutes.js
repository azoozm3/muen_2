import { z } from "zod";
import { VolunteerRequest } from "../../../models/VolunteerRequest.js";
import { requireAuth, sendZodError } from "../../../routes/helpers.js";
import { createVolunteerRequestSchema } from "../volunteer-request.schemas.js";
import { createVolunteerRequestNumber, serializeVolunteerRequest } from "../volunteer-request.service.js";

export function registerVolunteerCreateRoutes(app, { storage }) {
  app.post("/api/volunteer-requests", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "patient") return res.status(403).json({ message: "Only patients can create volunteer requests" });
      const parsed = createVolunteerRequestSchema.parse(req.body || {});
      const patient = await storage.getUserById(req.session.userId);
      if (!patient) return res.status(404).json({ message: "Patient not found" });

      const identifiers = await createVolunteerRequestNumber();
      const created = await VolunteerRequest.create({
        ...identifiers,
        patientId: String(patient.id || patient._id),
        patientName: parsed.patientName || patient.name || "Patient",
        patientPhone: parsed.patientPhone || patient.phone || "",
        serviceType: parsed.serviceType,
        address: parsed.address,
        latitude: parsed.latitude ?? null,
        longitude: parsed.longitude ?? null,
        locationNote: parsed.locationNote,
        details: parsed.details,
        urgency: parsed.urgency,
      });

      if (typeof storage.createActivityLog === "function") {
        await storage.createActivityLog(patient.id || patient._id, patient.name, "volunteer_request_created", `Volunteer request ${created.publicRequestId} created`);
      }
      res.status(201).json(serializeVolunteerRequest(created));
    } catch (err) {
      if (err instanceof z.ZodError) return sendZodError(res, err);
      console.error("POST /api/volunteer-requests error:", err);
      res.status(500).json({ message: err.message || "Failed to create volunteer request" });
    }
  });
}
