import { Button } from "@/components/ui/button";
import { AdminSectionCard } from "@/features/admin/components/AdminSectionCard";
import { AdminStatCard } from "@/features/admin/components/AdminStatCard";
import { AdminTable } from "@/features/admin/components/AdminTable";
import { formatDate } from "@/features/admin/utils/adminFormatters";

export function VolunteersSection({ usersData, requestsData, mutationState, onToggleActive, onDelete }) {
  const volunteers = usersData?.users || [];
  const userSummary = usersData?.summary || {};
  const requestSummary = requestsData?.summary?.volunteer || {};

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-6">
        <AdminStatCard label="Volunteers" value={userSummary.total || 0} />
        <AdminStatCard label="Active Accounts" value={userSummary.active || 0} />
        <AdminStatCard label="Inactive Accounts" value={userSummary.inactive || 0} />
        <AdminStatCard label="Completed Jobs" value={userSummary.totalCompletedServices || 0} />
        <AdminStatCard label="Open Requests" value={requestSummary.active || 0} />
        <AdminStatCard label="All Requests" value={requestSummary.total || 0} />
      </div>

      <AdminSectionCard title="Volunteers" subtitle="All volunteer accounts in one place.">
        <AdminTable
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "rating", label: "Rating", render: (row) => row.rating || "—" },
            { key: "totalServices", label: "Total Jobs", render: (row) => row.totalServices || 0 },
            { key: "completedServices", label: "Completed", render: (row) => row.completedServices || 0 },
            { key: "active", label: "Status", render: (row) => (row.active ? "Active" : "Inactive") },
            { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" disabled={mutationState} onClick={() => onToggleActive(row)}>
                    {row.active ? "Disable" : "Enable"}
                  </Button>
                  <Button type="button" variant="destructive" size="sm" disabled={mutationState} onClick={() => onDelete(row)}>
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          rows={volunteers}
          emptyText="No volunteers found."
          searchPlaceholder="Search volunteers"
          filterFields={[{ key: "active", label: "All account status", getValue: (row) => (row.active ? "Active" : "Inactive") }]}
        />
      </AdminSectionCard>
    </div>
  );
}
