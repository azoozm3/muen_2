import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavedRatingNotice } from "@/components/common/SavedRatingNotice";
import { NurseRatingDialog } from "@/components/nurse/NurseRatingDialog";
import { ReportDialogButton } from "@/components/nurse/ReportDialogButton";
import { hasVisitReport } from "@/features/nurse-requests/shared/requestStatus";
import { EmptyState, RequestCard } from "./NurseRequestCardParts";

export function HistorySection({ historyRequests }) {
  if (!historyRequests.length) return <EmptyState title="No history" text="Completed and cancelled requests appear here." />;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">History</h2>
        <p className="text-sm text-muted-foreground">Past nurse requests.</p>
      </div>

      <div className="space-y-3">
        {historyRequests.map((item) => {
          const canReview = item.status === "completed" && item.nurseId && !item.patientRating;
          const canViewReport = item.status === "completed" && hasVisitReport(item);

          return (
            <RequestCard
              key={item.id}
              item={item}
              actions={
                <>
                  {canViewReport ? <ReportDialogButton report={item.visitReport} /> : null}
                  {canReview ? (
                    <NurseRatingDialog nurseRequest={item}>
                      <Button type="button" variant="outline" className="gap-2 rounded-2xl"><Star className="h-4 w-4" />Rate</Button>
                    </NurseRatingDialog>
                  ) : null}
                </>
              }
              footer={item.patientRating ? <SavedRatingNotice title="Nurse rated successfully" rating={item.patientRating} feedback={item.patientFeedback} /> : null}
            />
          );
        })}
      </div>
    </section>
  );
}
