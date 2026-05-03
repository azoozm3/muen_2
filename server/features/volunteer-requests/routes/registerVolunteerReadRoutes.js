import { VolunteerRequest } from "../../../models/VolunteerRequest.js";
import { requireAuth } from "../../../routes/helpers.js";
import { serializeVolunteerRequest } from "../volunteer-request.service.js";

export function registerVolunteerReadRoutes(app) {
  app.get("/api/volunteer-requests", requireAuth, async (req, res) => {
    try {
      const role = req.session.userRole;
      const userId = String(req.session.userId);
      let query = {};

      if (role === "patient") query = { patientId: userId };
      else if (role === "volunteer") query = { $or: [{ status: "pending" }, { volunteerId: userId }] };
      else if (role !== "admin") return res.status(403).json({ message: "Access denied" });

      const items = await VolunteerRequest.find(query).sort({ createdAt: -1 }).lean();
      res.json(items.map(serializeVolunteerRequest));
    } catch (err) {
      console.error("GET /api/volunteer-requests error:", err);
      res.status(500).json({ message: err.message || "Failed to fetch volunteer requests" });
    }
  });
}
