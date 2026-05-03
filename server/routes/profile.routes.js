import { requireAuth } from "./helpers.js";
import { createProfileHandlers } from "./profile/profileHandlers.js";

export function registerProfileRoutes(app, { storage }) {
  const handlers = createProfileHandlers(storage);
  app.get("/api/profiles/me", requireAuth, handlers.readMe);
  app.get("/api/profiles/:id", handlers.readPublic);
  app.post("/api/patient-ratings", requireAuth, handlers.createPatientRating);
  app.patch("/api/profiles", requireAuth, handlers.updateMe);
}
