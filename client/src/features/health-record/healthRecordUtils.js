export function createEmptyMedicalHistoryRow() {
  return {
    title: "",
    details: "",
    recordDate: "",
  };
}

export function normalizeMedicalHistory(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({
    title: row?.title || "",
    details: row?.details || "",
    recordDate: row?.recordDate || "",
  }));
}
