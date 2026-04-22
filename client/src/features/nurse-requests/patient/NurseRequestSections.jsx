import { Button } from "@/components/ui/button";
import { EmptyState, RequestCard } from "./NurseRequestCardParts";
export { HistorySection } from "./NurseRequestHistorySection";

export function CurrentRequestsSection({ currentRequests, cancelMutation, onCancel }) {
  if (!currentRequests.length) return <EmptyState title="No current requests" text="Create a request to get started." />;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Current</h2>
        <p className="text-sm text-muted-foreground">Live nurse requests.</p>
      </div>

      <div className="space-y-3">
        {currentRequests.map((item) => (
          <RequestCard
            key={item.id}
            item={item}
            actions={<Button type="button" variant="destructive" onClick={() => onCancel(item.id)} disabled={cancelMutation.isPending}>{cancelMutation.isPending ? "Cancelling..." : "Cancel"}</Button>}
          />
        ))}
      </div>
    </section>
  );
}
