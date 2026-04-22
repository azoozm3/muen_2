import { registerNurseActionRoutes } from "../features/nurse-requests/routes/registerNurseActionRoutes.js";
import { registerNurseCreateRoutes } from "../features/nurse-requests/routes/registerNurseCreateRoutes.js";
import { registerNurseReadRoutes } from "../features/nurse-requests/routes/registerNurseReadRoutes.js";

export function registerNurseRoutes(app) {
  registerNurseReadRoutes(app);
  registerNurseCreateRoutes(app);
  registerNurseActionRoutes(app);
}
