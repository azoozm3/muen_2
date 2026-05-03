import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminSectionCard } from "@/features/admin/components/AdminSectionCard";
import { AdminStatCard } from "@/features/admin/components/AdminStatCard";
import { AdminTable } from "@/features/admin/components/AdminTable";
import { useMarkProviderPaid } from "@/features/admin/hooks/useAdminData";
import { formatMoney } from "@/features/admin/utils/adminFormatters";
import { createPayoutColumns, paymentDetailsColumns } from "./helpers/paymentColumns";

function MarkPaidButton({ row, mutation, onClick }) {
  const isLoading = mutation.isPending && mutation.variables?.providerId === row.providerId;
  return (
    <Button size="sm" disabled={row.actionDisabled || isLoading} onClick={() => onClick(row)} className="border-yellow-400 bg-yellow-300 text-yellow-950 hover:bg-yellow-200">
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {row.dueAmount > 0 ? "Mark paid" : "Paid"}
    </Button>
  );
}

function PayoutTable({ title, subtitle, label, rows, mutation, onMarkPaid, emptyText }) {
  return (
    <AdminSectionCard title={title} subtitle={subtitle}>
      <AdminTable columns={createPayoutColumns(label, (row) => <MarkPaidButton row={row} mutation={mutation} onClick={onMarkPaid} />)} rows={rows} emptyText={emptyText} />
    </AdminSectionCard>
  );
}

export function PaymentsSection({ data }) {
  const { toast } = useToast();
  const markProviderPaid = useMarkProviderPaid();
  const summary = data?.summary || {};

  const handleMarkPaid = async (row) => {
    try {
      const result = await markProviderPaid.mutateAsync({ providerType: row.providerType, providerId: row.providerId });
      toast({ title: "Payout updated", description: `${row.providerName || "Provider"} marked as paid for ${result?.modifiedCount || 0} record(s).` });
    } catch (error) {
      toast({ title: "Failed to update payout", description: error.message || "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <AdminStatCard label="Gross" value={formatMoney(summary.grossAmount)} />
        <AdminStatCard label="Platform Fee" value={formatMoney(summary.platformFee)} />
        <AdminStatCard label="Provider Net" value={formatMoney(summary.providerNetAmount)} />
        <AdminStatCard label="Doctors Due" value={formatMoney(summary.doctorDueAmount)} />
        <AdminStatCard label="Nurses Due" value={formatMoney(summary.nurseDueAmount)} />
        <AdminStatCard label="Paid Out" value={formatMoney(summary.totalPaidAmount)} helper={`${summary.capturedCount || 0} captured · ${summary.refundedCount || 0} refunded`} />
      </div>

      <PayoutTable title="Doctors Payouts" subtitle="Each doctor with completed paid appointments and current due amount." label="Doctor" rows={data?.doctorPayouts || []} mutation={markProviderPaid} onMarkPaid={handleMarkPaid} emptyText="No doctor payouts." />
      <PayoutTable title="Nurses Payouts" subtitle="Each nurse with completed paid requests and current due amount." label="Nurse" rows={data?.nursePayouts || []} mutation={markProviderPaid} onMarkPaid={handleMarkPaid} emptyText="No nurse payouts." />

      <AdminSectionCard title="Payments Details" subtitle="All appointment and nurse request payments with status and payout info.">
        <AdminTable columns={paymentDetailsColumns} rows={data?.payments || []} emptyText="No payments." />
      </AdminSectionCard>
    </div>
  );
}
