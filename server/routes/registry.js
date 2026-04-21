import { registerAdminRoutes } from "./admin.routes.js";
import { registerAppointmentRoutes } from "./appointment.routes.js";
import { registerAuthRoutes } from "./auth.routes.js";
import { registerDoctorRoutes } from "./doctor.routes.js";
import { registerNurseRoutes } from "./nurse.routes.js";
import { registerPaymentRoutes } from "./payment.routes.js";
import { registerProfileRoutes } from "./profile.routes.js";
import { registerRequestRoutes } from "./request.routes.js";
import { registerVolunteerRoutes } from "./volunteer.routes.js";

export const routeRegistrars = [
  registerAuthRoutes,
  registerProfileRoutes,
  registerDoctorRoutes,
  registerRequestRoutes,
  registerAppointmentRoutes,
  registerPaymentRoutes,
  registerNurseRoutes,
  registerVolunteerRoutes,
  registerAdminRoutes,
];
