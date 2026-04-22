export function buildAppointmentStartTime(date, time) {
  const safeDate = String(date || "").trim();
  const safeTime = String(time || "").trim();
  if (!safeDate || !safeTime) return "";

  return `${safeDate}T${safeTime}:00`;
}

export function cleanPrescriptionItems(items = []) {
  return items.filter((item) => Object.values(item).some((value) => String(value || "").trim().length));
}
