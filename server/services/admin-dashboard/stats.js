import { byNewest } from "./adminDashboardUtils.js";
import { buildPaymentRows, buildProviderPayoutRows, createPayoutSummary, finaliseMoney, sumPayments } from "./payments.js";
import { getMappedAppointments, getMappedNurseRequests, getMappedRequestCollections, getMappedUsers, loadBaseAdminData } from "./queries.js";
import { createAppointmentsSummary, createDashboardSummary, createEnrichedUser, createRequestsSummary, createRoleBreakdown, createUsersSummary, countByStatus } from "./helpers/statsHelpers.js";
import { getProviderStatsMap } from "./helpers/providerStats.js";

export { createRoleBreakdown, countByStatus };

export async function getAdminDashboardData() {
  const { users, emergencyRequests, nurseRequests, volunteerRequests, appointments, logs, appSettings } = await loadBaseAdminData();
  const nursePaymentTotals = sumPayments(nurseRequests);
  const appointmentPaymentTotals = sumPayments(appointments);
  const paymentTotals = finaliseMoney({
    grossAmount: nursePaymentTotals.grossAmount + appointmentPaymentTotals.grossAmount,
    platformFee: nursePaymentTotals.platformFee + appointmentPaymentTotals.platformFee,
    providerNetAmount: nursePaymentTotals.providerNetAmount + appointmentPaymentTotals.providerNetAmount,
    refundedCount: nursePaymentTotals.refundedCount + appointmentPaymentTotals.refundedCount,
    capturedCount: nursePaymentTotals.capturedCount + appointmentPaymentTotals.capturedCount,
  });

  return {
    summary: createDashboardSummary({ users, emergencyRequests, nurseRequests, volunteerRequests, appointments, paymentTotals }),
    recentUsers: users.slice(0, 8),
    recentRequests: [...emergencyRequests, ...nurseRequests, ...volunteerRequests].sort(byNewest).slice(0, 8),
    recentAppointments: appointments.slice(0, 8),
    recentActivity: logs,
    servicePricing: appSettings?.servicePricing || null,
  };
}

export async function getAdminUsersData(role = "all") {
  const users = await getMappedUsers();
  const filtered = role === "all" ? users : users.filter((user) => user.role === role);
  const providerStatsMap = await getProviderStatsMap(role);
  const enrichedUsers = filtered.map((user) => createEnrichedUser(user, providerStatsMap[user.id] || {}));

  return {
    summary: createUsersSummary(enrichedUsers),
    users: enrichedUsers,
  };
}

export async function getAdminRequestsData() {
  const { emergencyRequests, nurseRequests, volunteerRequests } = await getMappedRequestCollections();
  return { summary: createRequestsSummary({ emergencyRequests, nurseRequests, volunteerRequests }), emergencyRequests, nurseRequests, volunteerRequests };
}

export async function getAdminAppointmentsData() {
  const appointments = await getMappedAppointments();
  return { summary: createAppointmentsSummary(appointments), appointments };
}

export async function getAdminPaymentsData() {
  const [appointments, nurseRequests] = await Promise.all([getMappedAppointments(), getMappedNurseRequests()]);
  const rows = buildPaymentRows(appointments, nurseRequests);
  const doctorPayouts = buildProviderPayoutRows(appointments, "doctor");
  const nursePayouts = buildProviderPayoutRows(nurseRequests, "nurse");

  return {
    summary: { ...finaliseMoney(sumPayments(rows)), ...createPayoutSummary(doctorPayouts, nursePayouts) },
    doctorPayouts,
    nursePayouts,
    payments: rows,
  };
}

export async function getAdminAnalyticsData() {
  const { users, emergencyRequests, nurseRequests, appointments, logs } = await loadBaseAdminData();
  return {
    roleBreakdown: createRoleBreakdown(users),
    emergencyByStatus: countByStatus(emergencyRequests),
    nurseByStatus: countByStatus(nurseRequests),
    appointmentByStatus: countByStatus(appointments),
    recentActivity: logs,
  };
}
