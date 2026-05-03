export function mapPaymentRow(item, service, providerType) {
  return {
    id: item.id,
    providerId: item.providerId,
    providerType,
    createdAt: item.createdAt,
    service,
    patientName: item.patientName,
    providerName: item.providerName || "Unassigned",
    status: item.status,
    payment: item.payment,
  };
}

export function toAppointmentPaymentRows(appointments) {
  return appointments.map((item) => mapPaymentRow(item, "Appointment", "doctor"));
}

export function toNursePaymentRows(nurseRequests) {
  return nurseRequests.map((item) => mapPaymentRow(item, "Nurse Request", "nurse"));
}
