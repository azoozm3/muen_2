import { z } from "zod";
import { User } from "../../../models/User.js";
import { requireAuth, sendZodError } from "../../../routes/helpers.js";
import { ratingSchema } from "../volunteer-request.schemas.js";
import { findVolunteerRequestByAnyId, serializeVolunteerRequest, updateVolunteerRating } from "../volunteer-request.service.js";

export function registerVolunteerRatingRoutes(app, { storage }) {
  app.post("/api/volunteer-requests/:id/patient-rating", requireAuth, async (req, res) => {
    try {
      const requestDoc = await findVolunteerRequestByAnyId(req.params.id);
      if (!requestDoc) return res.status(404).json({ message: "Volunteer request not found" });
      if (String(requestDoc.patientId) !== String(req.session.userId)) return res.status(403).json({ message: "Only the patient can rate this volunteer" });
      if (requestDoc.status !== "completed") return res.status(400).json({ message: "You can only rate completed requests" });
      if (!requestDoc.volunteerId) return res.status(400).json({ message: "No volunteer assigned to this request" });
      if (requestDoc.patientRating) return res.status(400).json({ message: "Volunteer already rated for this request" });

      const parsed = ratingSchema.parse(req.body || {});
      requestDoc.patientRating = parsed.rating;
      requestDoc.patientFeedback = parsed.feedback;
      await requestDoc.save();
      await updateVolunteerRating(requestDoc.volunteerId);

      const volunteer = await storage.getUserById(requestDoc.volunteerId);
      if (volunteer) {
        await User.findByIdAndUpdate(volunteer.id || volunteer._id, {
          $push: { patientRatings: { requestId: requestDoc.publicRequestId || String(requestDoc._id), patientId: String(req.session.userId), patientName: req.session.userName || requestDoc.patientName || "Patient", providerRole: "volunteer", rating: parsed.rating, feedback: parsed.feedback, createdAt: new Date() } },
          $set: { rating: volunteer.rating },
        });
      }

      res.json(serializeVolunteerRequest(requestDoc));
    } catch (err) {
      if (err instanceof z.ZodError) return sendZodError(res, err);
      console.error("POST /api/volunteer-requests/:id/patient-rating error:", err);
      res.status(500).json({ message: err.message || "Failed to save volunteer rating" });
    }
  });

  app.post("/api/volunteer-requests/:id/volunteer-rating", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "volunteer") return res.status(403).json({ message: "Only volunteers can rate patients" });
      const requestDoc = await findVolunteerRequestByAnyId(req.params.id);
      if (!requestDoc) return res.status(404).json({ message: "Volunteer request not found" });
      if (String(requestDoc.volunteerId) !== String(req.session.userId)) return res.status(403).json({ message: "This request is assigned to another volunteer" });
      if (requestDoc.status !== "completed") return res.status(400).json({ message: "You can only rate completed requests" });
      if (requestDoc.volunteerPatientRating) return res.status(400).json({ message: "Patient already rated for this request" });

      const parsed = ratingSchema.parse(req.body || {});
      requestDoc.volunteerPatientRating = parsed.rating;
      requestDoc.volunteerPatientFeedback = parsed.feedback;
      await requestDoc.save();

      const patient = await storage.getUserById(requestDoc.patientId);
      if (patient) {
        const existing = Array.isArray(patient.patientRatings) ? patient.patientRatings : [];
        const updatedRatings = [...existing, { requestId: requestDoc.publicRequestId || String(requestDoc._id), patientId: String(req.session.userId), patientName: req.session.userName || requestDoc.volunteerName || "Volunteer", providerRole: "volunteer", rating: parsed.rating, feedback: parsed.feedback, createdAt: new Date() }];
        const average = updatedRatings.length ? Number((updatedRatings.reduce((sum, item) => sum + Number(item.rating || 0), 0) / updatedRatings.length).toFixed(2)) : null;
        await User.findByIdAndUpdate(patient.id || patient._id, { $set: { patientRatings: updatedRatings, patientRating: average, patientRatingCount: updatedRatings.length } });
      }

      res.json(serializeVolunteerRequest(requestDoc));
    } catch (err) {
      if (err instanceof z.ZodError) return sendZodError(res, err);
      console.error("POST /api/volunteer-requests/:id/volunteer-rating error:", err);
      res.status(500).json({ message: err.message || "Failed to save patient rating" });
    }
  });
}
