import { VOLUNTEER_TERMINAL_STATUSES } from "../constants.js";
import { buildProviderPayoutRows, createProviderStatsMap } from "../payments.js";
import { getMappedAppointments, getMappedNurseRequests, getMappedVolunteerRequests } from "../queries.js";

export async function getProviderStatsMap(role) {
  if (role === "doctor") {
    return createProviderStatsMap(buildProviderPayoutRows(await getMappedAppointments(), "doctor"));
  }

  if (role === "nurse") {
    return createProviderStatsMap(buildProviderPayoutRows(await getMappedNurseRequests(), "nurse"));
  }

  if (role !== "volunteer") return {};

  const volunteerRequests = await getMappedVolunteerRequests();
  return volunteerRequests.reduce((acc, item) => {
    const key = item.providerId;
    if (!key) return acc;
    const current = acc[key] || { completedCount: 0, activeCount: 0, totalCount: 0 };
    current.totalCount += 1;
    if (item.status === "completed") current.completedCount += 1;
    if (!VOLUNTEER_TERMINAL_STATUSES.has(item.status)) current.activeCount += 1;
    acc[key] = current;
    return acc;
  }, {});
}
