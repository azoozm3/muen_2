import { requireAuth, sendZodError } from "../../../routes/helpers.js";
import { createNurseRequestSchema, createRequestFromBody, serializeNurseRequest } from "./nurseRouteUtils.js";

export function registerNurseCreateRoutes(app) {
  app.post("/api/nurse-requests", requireAuth, async (req, res) => {
    if (req.currentUser.role !== "patient") return res.status(403).json({ message: "Only patients can create nurse requests" });
    const parsed = createNurseRequestSchema.safeParse(req.body || {});
    if (!parsed.success) return sendZodError(res, parsed.error);

    try {
      const request = await createRequestFromBody(req, parsed.data);
      res.status(201).json(serializeNurseRequest(request));
    } catch (error) {
      console.error("POST /api/nurse-requests error:", error);
      res.status(500).json({ message: error?.message || "Failed to create nurse request" });
    }
  });
}
