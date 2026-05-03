import { ZodError } from "zod";
import storage from "../../../storage/index.js";
import { requireAdmin, sendZodError } from "../../../routes/helpers.js";
import { markProviderPayoutsAsPaid } from "../../../services/admin-dashboard/index.js";
import { markProviderPayoutSchema, updateServiceSettingsSchema } from "../adminSchemas.js";

export function registerAdminSettingsRoutes(app) {
  app.post("/api/admin/payments/mark-provider-paid", requireAdmin, async (req, res) => {
    try {
      const payload = markProviderPayoutSchema.parse(req.body || {});
      res.json(await markProviderPayoutsAsPaid({
        providerType: payload.providerType,
        providerId: payload.providerId,
        adminId: String(req.session?.userId || ""),
      }));
    } catch (err) {
      if (err instanceof ZodError) return sendZodError(res, err);
      console.error("POST /api/admin/payments/mark-provider-paid error:", err);
      res.status(400).json({ message: err.message || "Failed to mark provider payout as paid" });
    }
  });

  app.get("/api/admin/settings", requireAdmin, async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json({ servicePricing: stats.finance.servicePricing });
    } catch (err) {
      console.error("GET /api/admin/settings error:", err);
      res.status(500).json({ message: "Failed to fetch admin settings" });
    }
  });

  app.patch("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const updated = await storage.updateServiceSettings(updateServiceSettingsSchema.parse(req.body || {}), {
        userId: req.session.userId,
        userName: req.session.userName,
      });
      res.json(updated);
    } catch (err) {
      if (err instanceof ZodError) return sendZodError(res, err);
      console.error("PATCH /api/admin/settings error:", err);
      res.status(500).json({ message: err.message || "Failed to update settings" });
    }
  });
}
