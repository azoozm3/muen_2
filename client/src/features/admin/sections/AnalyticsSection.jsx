import { AdminSectionCard } from "@/features/admin/components/AdminSectionCard";
import { AdminStatCard } from "@/features/admin/components/AdminStatCard";
import { AdminTable } from "@/features/admin/components/AdminTable";
import { formatDate, formatLabel } from "@/features/admin/utils/adminFormatters";

function BreakdownCard({ title, data }) {
  return (
    <AdminSectionCard title={title} subtitle="Counts by status.">
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(data || {}).map(([key, value]) => (
          <AdminStatCard key={key} label={formatLabel(key)} value={value} />
        ))}
      </div>
    </AdminSectionCard>
  );
}

export function AnalyticsSection({ data }) {
  return (
    <div className="space-y-6">
      <AdminSectionCard title="Roles" subtitle="Users by role.">
        <div className="grid gap-4 md:grid-cols-5">
          {Object.entries(data?.roleBreakdown || {}).map(([key, value]) => (
            <AdminStatCard key={key} label={formatLabel(key)} value={value} />
          ))}
        </div>
      </AdminSectionCard>

      <div className="grid gap-6 xl:grid-cols-3">
        <BreakdownCard title="Emergency" data={data?.emergencyByStatus} />
        <BreakdownCard title="Nurse" data={data?.nurseByStatus} />
        <BreakdownCard title="Appointments" data={data?.appointmentByStatus} />
      </div>

      <AdminSectionCard title="Recent Activity" subtitle="Latest admin-visible logs.">
        <AdminTable
          columns={[
            { key: "actorName", label: "Actor" },
            { key: "action", label: "Action" },
            { key: "details", label: "Details" },
            { key: "createdAt", label: "Time", render: (row) => formatDate(row.createdAt) },
          ]}
          rows={data?.recentActivity || []}
          emptyText="No activity."
        />
      </AdminSectionCard>
    </div>
  );
}
