import { registerAdminDashboardRoutes } from "../features/admin/routes/registerAdminDashboardRoutes.js";
import { registerAdminSettingsRoutes } from "../features/admin/routes/registerAdminSettingsRoutes.js";
import { registerAdminUserRoutes } from "../features/admin/routes/registerAdminUserRoutes.js";

export function registerAdminRoutes(app) {
  registerAdminDashboardRoutes(app);
  registerAdminUserRoutes(app);
  registerAdminSettingsRoutes(app);
}
