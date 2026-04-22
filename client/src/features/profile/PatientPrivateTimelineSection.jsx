import { Activity, AlertTriangle, CalendarDays, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";

function buildTimelineEvents({ appointments = [], emergencyRequests = [], medicalHistory = [], nurseRequests = [], volunteerRequests = [] }) {
  const safeEmergencyRequests = Array.isArray(emergencyRequests) ? emergencyRequests : emergencyRequests?.requests || [];
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safeMedicalHistory = Array.isArray(medicalHistory) ? medicalHistory : [];
  const safeNurseRequests = Array.isArray(nurseRequests) ? nurseRequests : [];
  const safeVolunteerRequests = Array.isArray(volunteerRequests) ? volunteerRequests : [];

  return [
    ...safeMedicalHistory.map((item, index) => ({
      type: "medical",
      id: `medical-${index}-${item.date || ""}`,
      title: item.title || "Medical record",
      description: item.details || "No details added.",
      date: item.date || null,
      badge: "Medical",
    })),
    ...safeAppointments.map((item) => ({
      type: "appointment",
      id: item._id || item.id,
      title: item.doctorName ? `Appointment with Dr. ${item.doctorName}` : "Appointment",
      description: [item.reason, item.notes, item.consultationSummary].filter(Boolean)[0] || `Status: ${item.status || "pending"}`,
      date: item.createdAt || item.updatedAt || item.date || null,
      badge: `Appointment • ${item.status || "pending"}`,
    })),
    ...safeEmergencyRequests.map((item) => ({
      type: "emergency",
      id: item._id || item.id,
      title: "Emergency request",
      description: [item.reason, item.description, item.location].filter(Boolean)[0] || `Status: ${item.status || "pending"}`,
      date: item.createdAt || item.updatedAt || null,
      badge: `Emergency • ${item.status || "pending"}`,
    })),
    ...safeNurseRequests.map((item) => ({
      type: "nurse",
      id: item._id || item.id,
      title: item.serviceType ? `Nurse request • ${item.serviceType}` : "Nurse request",
      description: [item.note, item.address].filter(Boolean)[0] || `Status: ${item.status || "pending"}`,
      date: item.createdAt || item.updatedAt || null,
      badge: `Nurse • ${item.status || "pending"}`,
    })),
    ...safeVolunteerRequests.map((item) => ({
      type: "volunteer",
      id: item._id || item.id,
      title: item.serviceType ? `Volunteer request • ${item.serviceType}` : "Volunteer request",
      description: [item.details, item.address].filter(Boolean)[0] || `Status: ${item.status || "pending"}`,
      date: item.createdAt || item.updatedAt || null,
      badge: `Volunteer • ${item.status || "pending"}`,
    })),
  ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

function getTimelineIcon(type) {
  if (type === "emergency") return AlertTriangle;
  if (type === "appointment") return CalendarDays;
  if (["nurse", "volunteer"].includes(type)) return ClipboardList;
  return Activity;
}

function formatTimelineDate(value) {
  if (!value) return "No date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export function PatientPrivateTimelineSection(props) {
  const events = buildTimelineEvents(props);

  return (
    <Card className="rounded-2xl p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-lg font-bold sm:text-xl">Private timeline</h2>
          <p className="text-sm text-muted-foreground">Your visits, requests, and records in one place.</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No records yet.</div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const Icon = getTimelineIcon(event.type);
            return (
              <div key={event.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {event.badge}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">{formatTimelineDate(event.date)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
