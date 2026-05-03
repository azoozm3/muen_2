function round2(value) {
  return Number((Number(value || 0)).toFixed(2));
}

export function sumFinanceRows(rows) {
  return rows.reduce((acc, row) => {
    acc.gross += Number(row.payment?.grossAmount || 0);
    acc.platformRevenue += Number(row.payment?.status === "refunded" ? 0 : row.payment?.platformFee || 0);
    acc.providerNet += Number(row.payment?.status === "refunded" ? 0 : row.payment?.providerNetAmount || 0);
    acc.refunded += Number(row.payment?.status === "refunded" ? row.payment?.grossAmount || 0 : 0);
    return acc;
  }, { gross: 0, platformRevenue: 0, providerNet: 0, refunded: 0 });
}

export function buildFinanceByProvider(rows, providerIdKey, providerNameKey, role, fallbackName) {
  const map = new Map();

  for (const item of rows) {
    const key = String(item[providerIdKey] || "");
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, { providerId: key, providerName: item[providerNameKey] || fallbackName, role, bookings: 0, gross: 0, platformRevenue: 0, providerNet: 0 });
    }

    const row = map.get(key);
    row.bookings += 1;
    row.gross += Number(item.payment?.grossAmount || 0);
    if (item.payment?.status !== "refunded") {
      row.platformRevenue += Number(item.payment?.platformFee || 0);
      row.providerNet += Number(item.payment?.providerNetAmount || 0);
    }
  }

  return Array.from(map.values());
}

export function finalizeFinanceRows(rows) {
  return rows
    .map((row) => ({ ...row, gross: round2(row.gross), platformRevenue: round2(row.platformRevenue), providerNet: round2(row.providerNet) }))
    .sort((a, b) => b.gross - a.gross);
}

export function buildFinanceTotals(appointments, nurseRequests) {
  const appointmentFinance = sumFinanceRows(appointments);
  const nurseFinance = sumFinanceRows(nurseRequests);
  return {
    gross: round2(appointmentFinance.gross + nurseFinance.gross),
    platformRevenue: round2(appointmentFinance.platformRevenue + nurseFinance.platformRevenue),
    providerNet: round2(appointmentFinance.providerNet + nurseFinance.providerNet),
    refunded: round2(appointmentFinance.refunded + nurseFinance.refunded),
  };
}
