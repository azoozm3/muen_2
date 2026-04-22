function buildDate(dateValue, timeValue = "") {
  if (!dateValue) return null;
  const parsed = new Date(`${dateValue}T${timeValue || "00:00"}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatRequestDay(dateValue) {
  const parsed = buildDate(dateValue);
  if (!parsed) return "—";

  const today = new Date();
  const isToday =
    parsed.getFullYear() === today.getFullYear() &&
    parsed.getMonth() === today.getMonth() &&
    parsed.getDate() === today.getDate();

  if (isToday) return "Today";
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(parsed);
}

export function formatRequestDate(dateValue) {
  const parsed = buildDate(dateValue);
  if (!parsed) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function formatRequestTime(timeValue, dateValue) {
  if (!timeValue) return "—";
  const parsed = buildDate(dateValue || new Date().toISOString().slice(0, 10), timeValue);
  if (!parsed) return timeValue;

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
}
