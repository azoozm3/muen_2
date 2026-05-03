import { requireAuth } from "../../../routes/helpers.js";
import { getVisibleNurseRequests, serializeNurseRequest } from "./nurseRouteUtils.js";

export function registerNurseReadRoutes(app) {
  app.get("/api/nurse-requests", requireAuth, async (req, res) => {
    try {
      const data = await getVisibleNurseRequests(req.currentUser);
      res.json(data.map(serializeNurseRequest));
    } catch (error) {
      if (error?.message === "ACCESS_DENIED") return res.status(403).json({ message: "Access denied" });
      console.error("GET /api/nurse-requests error:", error);
      res.status(500).json({ message: "Failed to fetch nurse requests" });
    }
  });
}
