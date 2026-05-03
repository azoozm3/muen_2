import { formatDate, formatLabel, formatMoney } from "@/features/admin/utils/adminFormatters";
import { getAdminLocationLink } from "@/features/admin/utils/adminLocation";

function renderMapLocation(row = {}) {
  const { text, href } = getAdminLocationLink(row);

  if (!href) return text;

  return (
    <div className="space-y-1">
      <div>{text}</div>
      <a className="text-xs text-blue-600 hover:underline" href={href} target="_blank" rel="noreferrer">
        Open map
      </a>
    </div>
  );
}

const requestIdColumn = {
  key: "publicRequestId",
  label: "ID",
  render: (row) => row.publicRequestId || row.publicCaseId || row.publicAppointmentId || "—",
};

export const REQUEST_TABLE_FILTERS = [
  { key: "status", label: "All status" },
  { key: "serviceType", label: "All services" },
  { key: "providerType", label: "All provider types" },
  { key: "appointmentType", label: "All appointment types" },
  { key: "responderRole", label: "All responder roles" },
];

export const emergencyRequestsConfig = {
  title: "Emergency Requests",
  subtitle: "Emergency requests using the shared admin request layout.",
  tableTitle: "Emergency Requests Table",
  tableSubtitle: "Emergency records only.",
  emptyText: "No emergency requests.",
  searchPlaceholder: "Search emergency requests",
  filterFields: REQUEST_TABLE_FILTERS,
  columns: [
    requestIdColumn,
    { key: "patientName", label: "Patient" },
    { key: "responderName", label: "Responder", render: (row) => row.responderName || row.providerName || "—" },
    { key: "responderRole", label: "Role", render: (row) => formatLabel(row.responderRole || "unassigned") },
    { key: "emergencyType", label: "Type", render: (row) => row.emergencyType || "—" },
    { key: "status", label: "Status", render: (row) => formatLabel(row.status) },
    { key: "location", label: "Location", render: renderMapLocation },
    { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
  ],
};

export const nurseRequestsConfig = {
  title: "Nurse Requests",
  subtitle: "Nurse requests using the shared admin request layout.",
  tableTitle: "Nurse Requests Table",
  tableSubtitle: "Nurse request records only.",
  emptyText: "No nurse requests.",
  searchPlaceholder: "Search nurse requests",
  filterFields: REQUEST_TABLE_FILTERS,
  columns: [
    requestIdColumn,
    { key: "patientName", label: "Patient" },
    { key: "providerName", label: "Nurse", render: (row) => row.providerName || "—" },
    { key: "serviceType", label: "Service", render: (row) => row.serviceType || "—" },
    { key: "location", label: "Location", render: renderMapLocation },
    { key: "status", label: "Status", render: (row) => formatLabel(row.status) },
    { key: "requestedDate", label: "Date", render: (row) => row.requestedDate || "—" },
    { key: "requestedTime", label: "Time", render: (row) => row.requestedTime || "—" },
    { key: "amount", label: "Amount", render: (row) => formatMoney(row.payment?.grossAmount, row.payment?.currency) },
    { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
  ],
};

export const volunteerRequestsConfig = {
  title: "Volunteer Requests",
  subtitle: "Volunteer requests using the shared admin request layout.",
  tableTitle: "Volunteer Requests Table",
  tableSubtitle: "Volunteer request records only.",
  emptyText: "No volunteer requests.",
  searchPlaceholder: "Search volunteer requests",
  filterFields: REQUEST_TABLE_FILTERS,
  columns: [
    requestIdColumn,
    { key: "patientName", label: "Patient" },
    { key: "providerName", label: "Volunteer", render: (row) => row.providerName || "—" },
    { key: "serviceType", label: "Service", render: (row) => row.serviceType || "—" },
    { key: "status", label: "Status", render: (row) => formatLabel(row.status) },
    { key: "location", label: "Location", render: renderMapLocation },
    { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
  ],
};

export const appointmentRequestsConfig = {
  title: "Appointment Requests",
  subtitle: "Appointments using the shared admin request layout.",
  tableTitle: "Appointment Requests Table",
  tableSubtitle: "Appointment records only.",
  emptyText: "No appointments.",
  searchPlaceholder: "Search appointment requests",
  filterFields: REQUEST_TABLE_FILTERS,
  extraSummaryStats: (summary = {}) => [
    { label: "Online", value: summary.online || 0 },
  ],
  columns: [
    requestIdColumn,
    { key: "patientName", label: "Patient" },
    { key: "providerName", label: "Doctor", render: (row) => row.providerName || "—" },
    { key: "specialty", label: "Specialty", render: (row) => row.specialty || "—" },
    { key: "appointmentType", label: "Type", render: (row) => formatLabel(row.appointmentType) },
    { key: "date", label: "Date", render: (row) => row.date || "—" },
    { key: "time", label: "Time", render: (row) => row.time || "—" },
    { key: "amount", label: "Amount", render: (row) => formatMoney(row.payment?.grossAmount, row.payment?.currency) },
    { key: "status", label: "Status", render: (row) => formatLabel(row.status) },
    { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
  ],
};
