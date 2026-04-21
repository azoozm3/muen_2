export function toObjectIdString(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value?.toString === "function") return value.toString();
  return String(value);
}

export function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function roundMoney(value) {
  return Number(safeNumber(value).toFixed(2));
}

export function byNewest(a, b) {
  return new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime();
}
