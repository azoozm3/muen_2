import { routeRegistrars } from "./routes/registry.js";
import { seedDatabase } from "./seed/index.js";
import { prepareStorage, storage } from "./storage.js";

export async function registerRoutes(httpServer, app) {
  const context = { storage };

  for (const registerRoute of routeRegistrars) {
    registerRoute(app, context);
  }

  await seedDatabase(storage);
  await prepareStorage(storage);

  return httpServer;
}
