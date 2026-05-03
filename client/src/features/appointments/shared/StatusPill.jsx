import { appointmentStatusStyles } from "./statusStyles";

export default function StatusPill({ status }) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${appointmentStatusStyles[status] || ""}`}>{String(status).replace("_", " ")}</span>;
}
