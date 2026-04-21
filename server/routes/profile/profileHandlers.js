import { updateProfileSchema } from "../../../shared/schema.js";
import { sanitizeUser, sendZodError } from "../helpers.js";
import { buildPublicProviderSummary, getProfileRatings, getPublicPatientRatings } from "./profileHelpers.js";

export function createProfileHandlers(storage) {
  return {
    readMe: async (req, res) => {
      const user = await storage.getUserById(req.session.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const ratings = await getProfileRatings(user);
      res.json({ ...sanitizeUser(user), ...ratings });
    },

    readPublic: async (req, res) => {
      const user = await storage.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.role === "patient") {
        const patientRatings = await getPublicPatientRatings(req.params.id);
        return res.json({ ...sanitizeUser(user), patientRatings });
      }

      const { providerRatings } = await getProfileRatings(user);
      const ratingSummary = buildPublicProviderSummary(user, providerRatings);
      return res.json({ ...sanitizeUser(user), ...ratingSummary, providerRatings });
    },

    createPatientRating: async (req, res) => {
      try {
        const { patientId, interactionType, interactionId, rating, feedback = "" } = req.body || {};
        if (!patientId || !interactionType || !interactionId || !rating) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        if (!["doctor", "nurse", "volunteer"].includes(req.session.userRole)) {
          return res.status(403).json({ message: "Only providers can rate patients" });
        }

        const saved = await storage.createPatientInteractionRating({
          patientId,
          providerId: req.session.userId,
          providerRole: req.session.userRole,
          interactionType,
          interactionId,
          rating: Number(rating),
          feedback,
        });

        res.status(201).json(saved);
      } catch (error) {
        if (error?.code === 11000) {
          return res.status(400).json({ message: "Patient rating already saved for this interaction" });
        }
        throw error;
      }
    },

    updateMe: async (req, res) => {
      try {
        const data = updateProfileSchema.parse(req.body);
        const updated = await storage.updateProfile(req.session.userId, data);
        if (!updated) return res.status(404).json({ message: "User not found" });

        await storage.createActivityLog(req.session.userId, updated.name, "profile_updated", `${updated.role} profile updated`);
        res.json(sanitizeUser(updated));
      } catch (error) {
        return sendZodError(res, error);
      }
    },
  };
}
