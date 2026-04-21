import { AdminSectionCard } from "@/features/admin/components/AdminSectionCard";
import { AdminStatCard } from "@/features/admin/components/AdminStatCard";
import { AdminTable } from "@/features/admin/components/AdminTable";
import { formatDate, formatLabel, formatMoney } from "@/features/admin/utils/adminFormatters";

export function DashboardSection({ data }) {
  const summary = data?.summary;
  const payments = summary?.payments || {};
  const pricing = data?.servicePricing || {};

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Users" value={summary?.totalUsers || 0} helper={`${summary?.activeUsers || 0} active`} />
        <AdminStatCard label="Emergency" value={summary?.activeEmergencyRequests || 0} helper={`${summary?.emergencyRequests || 0} total`} />
        <AdminStatCard label="Nurse Requests" value={summary?.activeNurseRequests || 0} helper={`${summary?.nurseRequests || 0} total`} />
        <AdminStatCard label="Appointments" value={summary?.activeAppointments || 0} helper={`${summary?.appointments || 0} total`} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminStatCard label="Revenue" value={formatMoney(payments.grossAmount)} helper="Captured gross" />
        <AdminStatCard label="Platform Fee" value={formatMoney(payments.platformFee)} helper="Net to platform" />
        <AdminStatCard label="Provider Net" value={formatMoney(payments.providerNetAmount)} helper="Net to providers" />
      </div>

      <AdminSectionCard title="Role Breakdown" subtitle="Current user distribution.">
        <div className="grid gap-4 md:grid-cols-5">
          {Object.entries(summary?.roleBreakdown || {}).map(([key, value]) => (
            <AdminStatCard key={key} label={formatLabel(key)} value={value} />
          ))}
        </div>
      </AdminSectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSectionCard title="Recent Requests" subtitle="Emergency and nurse requests.">
          <AdminTable
            columns={[
              { key: "type", label: "Type", render: (row) => formatLabel(row.type) },
              {
                key: "requestNumber",
                label: "Reference",
                render: (row) => row.publicRequestId || row.requestNumber || "—",
              },
              { key: "patientName", label: "Patient" },
              {
                key: "providerName",
                label: "Provider",
                render: (row) => row.providerName || row.responderName || "—",
              },
              { key: "status", label: "Status", render: (row) => formatLabel(row.status) },
              { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
            ]}
            rows={data?.recentRequests || []}
            emptyText="No recent requests."
          />
        </AdminSectionCard>

        <AdminSectionCard title="Recent Appointments" subtitle="Latest booked appointments.">
          <AdminTable
            columns={[
              { key: "patientName", label: "Patient" },
              { key: "providerName", label: "Doctor" },
              { key: "appointmentType", label: "Type", render: (row) => formatLabel(row.appointmentType) },
              { key: "status", label: "Status", render: (row) => formatLabel(row.status) },
              { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
            ]}
            rows={data?.recentAppointments || []}
            emptyText="No recent appointments."
          />
        </AdminSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSectionCard title="Pricing" subtitle="Current service pricing.">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminStatCard
              label={pricing?.appointment?.label || "Appointment"}
              value={formatMoney(pricing?.appointment?.price, pricing?.appointment?.currency)}
              helper={`Fee ${formatMoney(pricing?.appointment?.platformFee, pricing?.appointment?.currency)}`}
            />
            <AdminStatCard
              label={pricing?.nurseRequest?.label || "Nurse Request"}
              value={formatMoney(pricing?.nurseRequest?.price, pricing?.nurseRequest?.currency)}
              helper={`Fee ${formatMoney(pricing?.nurseRequest?.platformFee, pricing?.nurseRequest?.currency)}`}
            />
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Recent Activity" subtitle="Last system events.">
          <AdminTable
            columns={[
              { key: "actorName", label: "Actor" },
              { key: "action", label: "Action" },
              { key: "details", label: "Details" },
              { key: "createdAt", label: "Time", render: (row) => formatDate(row.createdAt) },
            ]}
            rows={data?.recentActivity || []}
            emptyText="No activity yet."
          />
        </AdminSectionCard>
      </div>
    </div>
  );
}
