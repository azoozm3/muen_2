import { z } from "zod";
import { requireAuth, requireAdmin, sendZodError } from "./helpers.js";
import { createPaypalOrder, capturePaypalOrder } from "../services/payment-gateway.service.js";
import { ensureAppSettings, toPublicSettings, updateAppSettings } from "../services/app-settings.service.js";
import { consumeCapturedPayment, saveCapturedPaymentSession, saveSession } from "../services/payment-session.service.js";

const createOrderSchema = z.object({
  serviceKey: z.enum(["appointment", "nurseRequest"]),
  referenceId: z.string().optional().default(""),
});

const captureOrderSchema = z.object({
  orderId: z.string().min(1),
  serviceKey: z.enum(["appointment", "nurseRequest"]),
});

export { consumeCapturedPayment };

export async function registerPaymentRoutes(app) {
  app.get("/api/service-settings", async (_req, res) => {
    try {
      const settings = await ensureAppSettings();
      res.json(toPublicSettings(settings));
    } catch (error) {
      console.error("GET /api/service-settings error", error);
      res.status(500).json({ message: "Failed to load service settings" });
    }
  });

  app.patch("/api/service-settings", requireAdmin, async (req, res) => {
    try {
      const payload = req.body || {};
      const settings = await updateAppSettings(payload);
      res.json(toPublicSettings(settings));
    } catch (error) {
      console.error("PATCH /api/service-settings error", error);
      res.status(400).json({ message: error.message || "Failed to update service settings" });
    }
  });

  app.post("/api/payments/orders", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "patient") {
        return res.status(403).json({ message: "Only patients can start a payment" });
      }

      const { serviceKey, referenceId } = createOrderSchema.parse(req.body || {});
      const result = await createPaypalOrder({ serviceKey, referenceId });

      res.json({
        orderId: result.orderId,
        provider: result.provider,
        pricing: result.pricing,
      });
    } catch (error) {
      if (error instanceof z.ZodError) return sendZodError(res, error);
      console.error("POST /api/payments/orders error", error);
      res.status(500).json({ message: error.message || "Failed to create payment order" });
    }
  });

  app.post("/api/payments/capture", requireAuth, async (req, res) => {
    try {
      if (req.session.userRole !== "patient") {
        return res.status(403).json({ message: "Only patients can capture a payment" });
      }

      const { orderId, serviceKey } = captureOrderSchema.parse(req.body || {});
      const result = await capturePaypalOrder({ orderId, serviceKey });
      const sessionPayment = saveCapturedPaymentSession(req, {
        orderId,
        serviceKey,
        provider: result.provider,
        providerOrderId: result.providerOrderId,
        captureId: result.captureId,
        pricing: result.pricing,
      });

      await saveSession(req);
      res.json(sessionPayment);
    } catch (error) {
      if (error instanceof z.ZodError) return sendZodError(res, error);
      console.error("POST /api/payments/capture error", error);
      res.status(500).json({ message: error.message || "Failed to capture payment" });
    }
  });
}
