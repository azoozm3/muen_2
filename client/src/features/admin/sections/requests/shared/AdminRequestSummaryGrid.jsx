import { AdminStatCard } from "@/features/admin/components/AdminStatCard";
import { formatLabel } from "@/features/admin/utils/adminFormatters";

export function AdminRequestSummaryGrid({ summary = {}, extraStats = [] }) {
  const statusStats = Object.entries(summary.byStatus || {}).map(([key, value]) => ({
    label: formatLabel(key),
    value,
  }));

  const stats = [
    { label: "Total", value: summary.total || 0 },
    { label: "Active", value: summary.active || 0 },
    ...extraStats.filter((item) => item && item.label),
    ...statusStats,
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-6">
      {stats.map((item) => (
        <AdminStatCard key={item.label} label={item.label} value={item.value ?? 0} helper={item.helper} />
      ))}
    </div>
  );
}
