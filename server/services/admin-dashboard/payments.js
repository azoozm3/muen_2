import { roundMoney, safeNumber } from "./adminDashboardUtils.js";
import { paymentSnapshot } from "./dashboardMappers.js";
import { toAppointmentPaymentRows, toNursePaymentRows } from "./helpers/paymentRows.js";
import { accumulateProviderRow, createEmptyProviderRow, finalizeProviderRows } from "./helpers/providerPayouts.js";

export function isCapturedPayment(payment = {}) {
  return payment.paymentStatus === "captured" && !payment.refunded;
}

export function isPayableService(item) {
  return item?.status === "completed" && isCapturedPayment(item?.payment);
}

export function sumPayments(items) {
  return items.reduce((totals, item) => {
    const payment = item.payment || paymentSnapshot(item);
    if (isCapturedPayment(payment)) {
      totals.grossAmount += safeNumber(payment.grossAmount);
      totals.platformFee += safeNumber(payment.platformFee);
      totals.providerNetAmount += safeNumber(payment.providerNetAmount);
      totals.capturedCount += 1;
    }
    totals.refundedCount += payment.refunded ? 1 : 0;
    return totals;
  }, { grossAmount: 0, platformFee: 0, providerNetAmount: 0, refundedCount: 0, capturedCount: 0 });
}

export function finaliseMoney(totals) {
  return {
    grossAmount: roundMoney(totals.grossAmount),
    platformFee: roundMoney(totals.platformFee),
    providerNetAmount: roundMoney(totals.providerNetAmount),
    refundedCount: totals.refundedCount,
    capturedCount: totals.capturedCount,
  };
}

export function buildPaymentRows(appointments, nurseRequests) {
  return [...toAppointmentPaymentRows(appointments), ...toNursePaymentRows(nurseRequests)]
    .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());
}

export function buildProviderPayoutRows(items, providerType) {
  const grouped = new Map();

  items.filter((item) => item.providerType === providerType && item.providerId).forEach((item) => {
    const current = grouped.get(item.providerId) || createEmptyProviderRow(item, providerType);
    grouped.set(item.providerId, accumulateProviderRow(current, item));
  });

  return finalizeProviderRows(grouped);
}

export function createProviderStatsMap(rows) {
  return rows.reduce((acc, row) => {
    if (row.providerId) acc[row.providerId] = row;
    return acc;
  }, {});
}

export function createPayoutSummary(doctorPayouts, nursePayouts) {
  const sumField = (rows, key) => roundMoney(rows.reduce((total, row) => total + safeNumber(row[key]), 0));
  const doctorDueAmount = sumField(doctorPayouts, "dueAmount");
  const doctorPaidAmount = sumField(doctorPayouts, "paidAmount");
  const nurseDueAmount = sumField(nursePayouts, "dueAmount");
  const nursePaidAmount = sumField(nursePayouts, "paidAmount");

  return {
    doctorDueAmount,
    doctorPaidAmount,
    nurseDueAmount,
    nursePaidAmount,
    totalDueAmount: roundMoney(doctorDueAmount + nurseDueAmount),
    totalPaidAmount: roundMoney(doctorPaidAmount + nursePaidAmount),
  };
}
