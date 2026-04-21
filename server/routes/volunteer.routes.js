import { registerVolunteerCreateRoutes } from "../features/volunteer/routes/registerVolunteerCreateRoutes.js";
import { registerVolunteerRatingRoutes } from "../features/volunteer/routes/registerVolunteerRatingRoutes.js";
import { registerVolunteerReadRoutes } from "../features/volunteer/routes/registerVolunteerReadRoutes.js";
import { registerVolunteerWorkflowRoutes } from "../features/volunteer/routes/registerVolunteerWorkflowRoutes.js";

export function registerVolunteerRoutes(app, { storage }) {
  registerVolunteerReadRoutes(app);
  registerVolunteerCreateRoutes(app, { storage });
  registerVolunteerWorkflowRoutes(app, { storage });
  registerVolunteerRatingRoutes(app, { storage });
}
