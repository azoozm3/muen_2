import storage from "../../../storage/index.js";

export async function getAppointmentsForSession({ userId, userRole }) {
  if (userRole === "doctor") return storage.getAppointmentsByDoctor(userId);
  if (userRole === "patient") return storage.getAppointmentsByPatient(userId);
  if (userRole === "admin") return storage.getAllAppointments();
  throw new Error("ACCESS_DENIED");
}

export async function getDoctorOwnedAppointment(appointmentId, doctorId) {
  const appointment = await storage.getAppointmentById(appointmentId);
  if (!appointment) throw new Error("APPOINTMENT_NOT_FOUND");
  if (String(appointment.doctorId) !== String(doctorId)) throw new Error("ACCESS_DENIED");
  return appointment;
}

export async function getPatientOwnedAppointment(appointmentId, patientId) {
  const appointment = await storage.getAppointmentById(appointmentId);
  if (!appointment) throw new Error("APPOINTMENT_NOT_FOUND");
  if (String(appointment.patientId) !== String(patientId)) throw new Error("ACCESS_DENIED");
  return appointment;
}
