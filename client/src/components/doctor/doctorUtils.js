import { ACTIVE_DOCTOR_STATUSES, HISTORY_DOCTOR_STATUSES } from "./doctorConstants";

export function getDoctorCaseGroups(requests = [], userId) {
  return {
    availableCases: requests.filter((request) => request.status === "pending"),
    myCases: requests.filter(
      (request) =>
        String(request.primaryResponderId) === String(userId) &&
        ACTIVE_DOCTOR_STATUSES.includes(request.status),
    ),
    resolvedCases: requests.filter(
      (request) =>
        HISTORY_DOCTOR_STATUSES.includes(request.status) &&
        String(request.primaryResponderId) === String(userId),
    ),
  };
}

export function getCaseDisplayId(request) {
  return request.publicCaseId || `CASE-${request.caseNumber || request.id || request._id}`;
}
