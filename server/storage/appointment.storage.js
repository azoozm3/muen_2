import { Appointment } from "./models.js";
import { attachAppointmentRatings, backfillAppointmentPhones, backfillEmergencyRequestPhones, buildAppointmentNotesUpdate, buildAppointmentStatusUpdate, buildZoomMeetingUpdate } from "./helpers/appointmentStorageHelpers.js";

export const appointmentStorageMethods = {
  async createAppointment(data) {
    return Appointment.create(data);
  },

  async backfillPatientPhones() {
    await backfillEmergencyRequestPhones();
    await backfillAppointmentPhones();
  },

  async getAppointmentsByDoctor(doctorId) {
    return attachAppointmentRatings(await Appointment.find({ doctorId: String(doctorId) }).sort({ createdAt: -1 }));
  },

  async getAppointmentsByPatient(patientId) {
    return attachAppointmentRatings(await Appointment.find({ patientId: String(patientId) }).sort({ createdAt: -1 }));
  },

  async getAllAppointments() {
    return attachAppointmentRatings(await Appointment.find({}).sort({ createdAt: -1 }));
  },

  async getAppointmentById(id) {
    return Appointment.findById(id);
  },

  async saveAppointmentZoomMeeting(id, zoomMeeting = {}) {
    return Appointment.findByIdAndUpdate(id, buildZoomMeetingUpdate(zoomMeeting), { returnDocument: "after" });
  },

  async updateAppointmentStatus(id, status) {
    return Appointment.findByIdAndUpdate(id, buildAppointmentStatusUpdate(status), { returnDocument: "after" });
  },

  async updateAppointmentNotes(id, consultationSummary, prescription = []) {
    return Appointment.findByIdAndUpdate(id, buildAppointmentNotesUpdate(consultationSummary, prescription), { returnDocument: "after" });
  },

  async markAppointmentReviewSubmitted(id) {
    return Appointment.findByIdAndUpdate(id, { reviewSubmitted: true, reviewedAt: new Date() }, { returnDocument: "after" });
  }
};
