export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export function formatMoney(value, currency = "USD") {
  const amount = Number(value || 0);
  return `${currency} ${amount.toFixed(2)}`;
}

export function formatLabel(value) {
  return String(value || "—").replaceAll("_", " ");
}

export function matchesText(value, search) {
  if (!search) return true;
  return String(value || "").toLowerCase().includes(search.toLowerCase());
}
