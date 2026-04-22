import { Appointment, AppSettings, EmergencyRequest, NurseRequest, User, ActivityLog } from "./models.js";
import { ensureAppSettings, toPublicSettings } from "../services/app-settings.service.js";
import { buildFinanceByProvider, buildFinanceTotals, finalizeFinanceRows } from "./helpers/admin/financeHelpers.js";
import { applyPaymentProvider, applyServicePricingRow } from "./helpers/admin/settingsHelpers.js";
import { buildAllowedAdminUserUpdate, buildUserSections } from "./helpers/admin/userHelpers.js";

export const adminStorageMethods = {
  async getAllUsers() {
    return User.find({}).sort({ createdAt: -1 }).lean();
  },

  async getStats() {
    const [users, emergencyRequests, appointments, nurseRequests, settings] = await Promise.all([
      User.find({}).sort({ createdAt: -1 }).lean(),
      EmergencyRequest.find({}).lean(),
      Appointment.find({}).lean(),
      NurseRequest.find({}).lean(),
      ensureAppSettings(),
    ]);

    const userSections = buildUserSections(users);
    const financeByProvider = finalizeFinanceRows([
      ...buildFinanceByProvider(appointments, "doctorId", "doctorName", "doctor", "Doctor"),
      ...buildFinanceByProvider(nurseRequests, "nurseId", "nurseName", "nurse", "Nurse"),
    ]);
    const activeEmergencies = emergencyRequests.filter((item) => !["completed", "cancelled", "resolved"].includes(String(item.status || "").toLowerCase())).length;

    return {
      totalUsers: users.length,
      activeEmergencies,
      resolvedCases: emergencyRequests.length - activeEmergencies,
      usersByRole: {
        patient: userSections.patients.length,
        doctor: userSections.doctors.length,
        nurse: userSections.nurses.length,
        other: userSections.others.length,
      },
      counts: {
        totalUsers: users.length,
        totalPatients: userSections.patients.length,
        totalDoctors: userSections.doctors.length,
        totalNurses: userSections.nurses.length,
        totalEmergencyRequests: emergencyRequests.length,
        totalAppointments: appointments.length,
        totalNurseRequests: nurseRequests.length,
      },
      userSections,
      finance: {
        totals: buildFinanceTotals(appointments, nurseRequests),
        byProvider: financeByProvider,
        servicePricing: toPublicSettings(settings).servicePricing,
      },
    };
  },

  async getRecentActivity(limit = 25) {
    const safeLimit = Math.max(1, Math.min(Number(limit) || 25, 100));
    return ActivityLog.find({}).sort({ createdAt: -1 }).limit(safeLimit).lean();
  },

  async updateUserRole(userId, role) {
    return User.findByIdAndUpdate(userId, { role }, { returnDocument: "after" }).lean();
  },

  async toggleUserStatus(userId, active) {
    return User.findByIdAndUpdate(userId, { active }, { returnDocument: "after" }).lean();
  },

  async updateUser(userId, data) {
    return User.findByIdAndUpdate(userId, { $set: buildAllowedAdminUserUpdate(data) }, { returnDocument: "after" }).lean();
  },

  async deleteUser(userId) {
    return User.findByIdAndDelete(userId).lean();
  },

  async updateServiceSettings(payload, updatedBy = {}) {
    const settings = await ensureAppSettings();
    applyServicePricingRow(settings.servicePricing.appointment, payload?.servicePricing?.appointment || {});
    applyServicePricingRow(settings.servicePricing.nurseRequest, payload?.servicePricing?.nurseRequest || {});
    applyPaymentProvider(settings.paymentProvider, payload?.paymentProvider || {});
    settings.updatedByUserId = updatedBy.userId || settings.updatedByUserId;
    settings.updatedByName = updatedBy.userName || settings.updatedByName;
    await settings.save();
    return toPublicSettings(settings);
  },
};
