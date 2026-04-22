import { roundMoney, safeNumber } from "../adminDashboardUtils.js";
import { isCapturedPayment, isPayableService } from "../payments.js";

export function createEmptyProviderRow(item, providerType) {
  return {
    providerId: item.providerId || "",
    providerType,
    providerName: item.providerName || "Unknown",
    completedCount: 0,
    capturedCount: 0,
    paidJobs: 0,
    unpaidJobs: 0,
    grossAmount: 0,
    platformFee: 0,
    providerNetAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    currency: item.payment?.currency || "USD",
    lastActivityAt: item.createdAt || null,
  };
}

export function accumulateProviderRow(current, item) {
  if (item.status === "completed") current.completedCount += 1;
  if (isCapturedPayment(item.payment)) current.capturedCount += 1;

  if (isPayableService(item)) {
    const net = safeNumber(item.payment?.providerNetAmount);
    current.grossAmount += safeNumber(item.payment?.grossAmount);
    current.platformFee += safeNumber(item.payment?.platformFee);
    current.providerNetAmount += net;
    if (item.payment?.providerPayoutStatus === "paid") {
      current.paidJobs += 1;
      current.paidAmount += net;
    } else {
      current.unpaidJobs += 1;
      current.dueAmount += net;
    }
  }

  if (new Date(item.createdAt || 0).getTime() > new Date(current.lastActivityAt || 0).getTime()) {
    current.lastActivityAt = item.createdAt || current.lastActivityAt;
  }

  return current;
}

export function finalizeProviderRows(grouped) {
  return Array.from(grouped.values())
    .map((row) => ({
      ...row,
      grossAmount: roundMoney(row.grossAmount),
      platformFee: roundMoney(row.platformFee),
      providerNetAmount: roundMoney(row.providerNetAmount),
      paidAmount: roundMoney(row.paidAmount),
      dueAmount: roundMoney(row.dueAmount),
      actionDisabled: !row.providerId || row.dueAmount <= 0,
    }))
    .sort((a, b) => {
      const dueDiff = safeNumber(b.dueAmount) - safeNumber(a.dueAmount);
      if (dueDiff !== 0) return dueDiff;
      return new Date(b.lastActivityAt || 0).getTime() - new Date(a.lastActivityAt || 0).getTime();
    });
}
