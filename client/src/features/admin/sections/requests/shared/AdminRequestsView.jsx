import { AdminSectionCard } from "@/features/admin/components/AdminSectionCard";
import { AdminTable } from "@/features/admin/components/AdminTable";
import { AdminRequestSummaryGrid } from "@/features/admin/sections/requests/shared/AdminRequestSummaryGrid";

export function AdminRequestsView({
  title,
  subtitle,
  tableTitle,
  tableSubtitle,
  summary,
  extraSummaryStats,
  columns,
  rows,
  emptyText,
  searchPlaceholder,
  filterFields,
  actions,
}) {
  return (
    <div className="space-y-6">
      <AdminSectionCard title={title} subtitle={subtitle}>
        <AdminRequestSummaryGrid summary={summary} extraStats={extraSummaryStats} />
      </AdminSectionCard>

      <AdminSectionCard title={tableTitle || `${title} Table`} subtitle={tableSubtitle} actions={actions}>
        <AdminTable
          columns={columns}
          rows={rows || []}
          emptyText={emptyText}
          searchPlaceholder={searchPlaceholder}
          filterFields={filterFields}
        />
      </AdminSectionCard>
    </div>
  );
}
