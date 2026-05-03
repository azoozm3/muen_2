export function getCellValue(column, row) {
  return column.render ? column.render(row) : row[column.key] ?? "—";
}

export function normalizeValue(value) {
  if (value === null || typeof value === "undefined") return "";
  if (["string", "number", "boolean"].includes(typeof value)) return String(value).toLowerCase();
  if (Array.isArray(value)) return value.map(normalizeValue).join(" ");
  if (typeof value === "object") return Object.values(value).map(normalizeValue).join(" ");
  return "";
}

export function normalizeFilterValue(value) {
  if (value === null || typeof value === "undefined" || value === "") return "";
  return String(value);
}

export function makeOptions(rows, field) {
  const accessor = typeof field.getValue === "function" ? field.getValue : (row) => row?.[field.key];
  return Array.from(new Set(rows.map(accessor).map(normalizeFilterValue).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}
