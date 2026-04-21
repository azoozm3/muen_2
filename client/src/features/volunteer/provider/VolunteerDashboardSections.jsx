import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingDialog } from "@/components/common/RatingDialog";
import { SavedRatingNotice } from "@/components/common/SavedRatingNotice";
import { VolunteerEmptyState, VolunteerRequestCard } from "@/features/volunteer/components/VolunteerRequestCard";

export function AvailableVolunteerRequestsTab({ items, onAccept, isPending = false }) {
  if (!items.length) return <VolunteerEmptyState title="No available requests" subtitle="New patient requests will appear here." />;

  return items.map((item) => (
    <VolunteerRequestCard key={item.id} item={item} showVolunteer={false}>
      <div className="flex justify-end">
        <Button className="gap-2 rounded-2xl" onClick={() => onAccept(item.id)} disabled={isPending}>
          <CheckCircle2 className="h-4 w-4" />
          Accept request
        </Button>
      </div>
    </VolunteerRequestCard>
  ));
}

export function ActiveVolunteerRequestsTab({ items, onStart, onComplete, isPending = false }) {
  if (!items.length) return <VolunteerEmptyState title="No active requests" subtitle="Accepted support tasks will appear here." />;

  return items.map((item) => (
    <VolunteerRequestCard key={item.id} item={item}>
      <div className="flex flex-wrap justify-end gap-2">
        {item.status === "accepted" ? (
          <Button variant="secondary" className="rounded-2xl" onClick={() => onStart(item.id)} disabled={isPending}>
            Start request
          </Button>
        ) : null}
        <Button variant="outline" className="rounded-2xl" onClick={() => onComplete(item.id)} disabled={isPending}>
          Mark as completed
        </Button>
      </div>
    </VolunteerRequestCard>
  ));
}

export function VolunteerHistoryTab({ items, onRatePatient, isPending = false }) {
  if (!items.length) return <VolunteerEmptyState title="No history yet" subtitle="Completed and cancelled requests will be shown here." />;

  return items.map((item) => (
    <VolunteerRequestCard key={item.id} item={item}>
      {item.patientRating ? <SavedRatingNotice title="Patient rated successfully" rating={item.patientRating} feedback={item.patientFeedback} /> : null}
      {item.status === "completed" && item.patientId && !item.patientRating ? (
        <RatingDialog
          title="Rate Patient"
          description="Leave a quick rating about the patient."
          loading={isPending}
          onSubmit={(payload) => onRatePatient(item.id, payload)}
          trigger={<Button variant="outline" className="w-full rounded-2xl sm:w-auto">Rate</Button>}
        />
      ) : null}
    </VolunteerRequestCard>
  ));
}
