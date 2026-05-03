import { registerAppointmentActionRoutes } from "../features/appointments/routes/registerAppointmentActionRoutes.js";
import { registerAppointmentCreateRoutes } from "../features/appointments/routes/registerAppointmentCreateRoutes.js";
import { registerAppointmentReadRoutes } from "../features/appointments/routes/registerAppointmentReadRoutes.js";

export function registerAppointmentRoutes(app) {
  registerAppointmentReadRoutes(app);
  registerAppointmentCreateRoutes(app);
  registerAppointmentActionRoutes(app);
}
