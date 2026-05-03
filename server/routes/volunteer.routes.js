import { registerVolunteerCreateRoutes } from "../features/volunteer-requests/routes/registerVolunteerCreateRoutes.js";
import { registerVolunteerRatingRoutes } from "../features/volunteer-requests/routes/registerVolunteerRatingRoutes.js";
import { registerVolunteerReadRoutes } from "../features/volunteer-requests/routes/registerVolunteerReadRoutes.js";
import { registerVolunteerWorkflowRoutes } from "../features/volunteer-requests/routes/registerVolunteerWorkflowRoutes.js";

export function registerVolunteerRoutes(app, { storage }) {
  registerVolunteerReadRoutes(app);
  registerVolunteerCreateRoutes(app, { storage });
  registerVolunteerWorkflowRoutes(app, { storage });
  registerVolunteerRatingRoutes(app, { storage });
}
