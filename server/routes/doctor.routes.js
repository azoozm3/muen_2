import { insertReviewSchema } from "../../shared/schema.js";
import { requireAuth, sanitizeUser, sendZodError } from "./helpers.js";

export function registerDoctorRoutes(app, { storage }) {
  app.get("/api/doctors", async (req, res) => {
    const specialty = typeof req.query.specialty === "string" ? req.query.specialty : undefined;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const minRating = req.query.minRating ? Number(req.query.minRating) : undefined;
    const onlineConsultation = req.query.onlineConsultation === "true";

    const doctors = await storage.getDoctors({ specialty, minRating, search, onlineConsultation });
    res.json(doctors.map(sanitizeUser));
  });

  app.get("/api/doctors/:id/reviews", async (req, res) => {
    const doctor = await storage.getUserById(req.params.id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const reviews = await storage.getReviews(req.params.id);
    res.json(reviews);
  });

  app.post("/api/doctors/:id/reviews", requireAuth, async (req, res) => {
    try {
      const doctorId = req.params.id;
      const doctor = await storage.getUserById(doctorId);
      if (!doctor || doctor.role !== "doctor") {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const review = await storage.createReview(
        insertReviewSchema.parse({
          ...req.body,
          doctorId,
          patientId: user.id,
          patientName: user.name,
        }),
      );

      await storage.updateDoctorRating(doctorId);
      res.status(201).json(review);
    } catch (err) {
      return sendZodError(res, err);
    }
  });
}
