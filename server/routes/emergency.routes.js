import { requireAuth } from "./helpers.js";
import { createEmergencyRequestHandlers } from "./emergency-request-routes/handlers.js";

export function registerEmergencyRoutes(app, { storage }) {
  const handlers = createEmergencyRequestHandlers(storage);

  app.get("/api/requests", handlers.listAll);
  app.get("/api/my/requests", requireAuth, handlers.listMine);
  app.post("/api/requests", handlers.create);
  app.get("/api/requests/:id", handlers.readOne);
  app.patch("/api/requests/:id/location", requireAuth, handlers.updatePatientLocation);
  app.patch("/api/requests/:id/responder-location", requireAuth, handlers.updateResponderLocation);
  app.post("/api/requests/:id/review", requireAuth, handlers.createReview);
  app.patch("/api/requests/:id/status", requireAuth, handlers.updateStatus);
}
