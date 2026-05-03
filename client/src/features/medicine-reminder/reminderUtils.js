export const STORAGE_KEY = "patient-medicine-reminders";

export const defaultReminders = [
  { id: "1", medicineName: "Paracetamol", dosage: "1 tablet", time: "08:00", frequency: "Daily", enabled: true, notes: "After breakfast" },
  { id: "2", medicineName: "Vitamin D", dosage: "1 capsule", time: "21:00", frequency: "Daily", enabled: true, notes: "Take with water" },
];

export const frequencies = ["Daily", "Twice Daily", "Weekly"];
export const emptyReminderForm = { medicineName: "", dosage: "", time: "", frequency: "Daily", notes: "" };

export function createReminderId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getStoredReminders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) ? parsed : defaultReminders;
  } catch {
    return defaultReminders;
  }
}

export function persistReminders(reminders) {
  if (reminders.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }
}

export function getNextReminder(reminders) {
  const enabled = reminders.filter((item) => item.enabled && item.time);
  if (!enabled.length) return null;
  return [...enabled].sort((a, b) => a.time.localeCompare(b.time))[0];
}
