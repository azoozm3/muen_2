import {
  APPOINTMENT_TERMINAL_STATUSES,
  EMERGENCY_TERMINAL_STATUSES,
  NURSE_TERMINAL_STATUSES,
  VOLUNTEER_TERMINAL_STATUSES,
} from "../constants.js";
import { roundMoney, safeNumber } from "../adminDashboardUtils.js";

export function createRoleBreakdown(users) {
  return users.reduce((acc, user) => {
    const role = user.role || "patient";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, { patient: 0, doctor: 0, nurse: 0, volunteer: 0, admin: 0 });
}

export function countByStatus(items) {
  return items.reduce((acc, item) => {
    const status = item.status || "unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
}

export function createDashboardSummary({ users, emergencyRequests, nurseRequests, volunteerRequests, appointments, paymentTotals }) {
  return {
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.active).length,
    roleBreakdown: createRoleBreakdown(users),
    emergencyRequests: emergencyRequests.length,
    nurseRequests: nurseRequests.length,
    appointments: appointments.length,
    volunteerRequests: volunteerRequests.length,
    activeEmergencyRequests: emergencyRequests.filter((item) => !EMERGENCY_TERMINAL_STATUSES.has(item.status)).length,
    activeNurseRequests: nurseRequests.filter((item) => !NURSE_TERMINAL_STATUSES.has(item.status)).length,
    activeVolunteerRequests: volunteerRequests.filter((item) => !VOLUNTEER_TERMINAL_STATUSES.has(item.status)).length,
    activeAppointments: appointments.filter((item) => !APPOINTMENT_TERMINAL_STATUSES.has(item.status)).length,
    payments: paymentTotals,
  };
}

export function createEnrichedUser(user, stats = {}) {
  return {
    ...user,
    completedServices: safeNumber(stats.completedCount),
    activeServices: safeNumber(stats.activeCount),
    totalServices: safeNumber(stats.totalCount),
    capturedServices: safeNumber(stats.capturedCount),
    unpaidJobs: safeNumber(stats.unpaidJobs),
    paidJobs: safeNumber(stats.paidJobs),
    providerNetAmount: roundMoney(stats.providerNetAmount),
    dueAmount: roundMoney(stats.dueAmount),
    paidAmount: roundMoney(stats.paidAmount),
  };
}

export function createUsersSummary(users) {
  return {
    total: users.length,
    active: users.filter((user) => user.active).length,
    inactive: users.filter((user) => !user.active).length,
    onlineConsultationEnabled: users.filter((user) => user.onlineConsultation).length,
    totalCompletedServices: users.reduce((total, user) => total + safeNumber(user.completedServices), 0),
    totalActiveServices: users.reduce((total, user) => total + safeNumber(user.activeServices), 0),
    totalDueAmount: roundMoney(users.reduce((total, user) => total + safeNumber(user.dueAmount), 0)),
    totalPaidAmount: roundMoney(users.reduce((total, user) => total + safeNumber(user.paidAmount), 0)),
  };
}

export function createRequestsSummary({ emergencyRequests, nurseRequests, volunteerRequests }) {
  return {
    emergency: {
      total: emergencyRequests.length,
      active: emergencyRequests.filter((item) => !EMERGENCY_TERMINAL_STATUSES.has(item.status)).length,
      byStatus: countByStatus(emergencyRequests),
    },
    nurse: {
      total: nurseRequests.length,
      active: nurseRequests.filter((item) => !NURSE_TERMINAL_STATUSES.has(item.status)).length,
      byStatus: countByStatus(nurseRequests),
    },
    volunteer: {
      total: volunteerRequests.length,
      active: volunteerRequests.filter((item) => !VOLUNTEER_TERMINAL_STATUSES.has(item.status)).length,
      byStatus: countByStatus(volunteerRequests),
    },
  };
}

export function createAppointmentsSummary(appointments) {
  return {
    total: appointments.length,
    active: appointments.filter((item) => !APPOINTMENT_TERMINAL_STATUSES.has(item.status)).length,
    online: appointments.filter((item) => item.appointmentType === "online").length,
    byStatus: countByStatus(appointments),
  };
}
