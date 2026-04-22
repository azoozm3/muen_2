import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingDialog } from "@/components/common/RatingDialog";
import { SavedRatingNotice } from "@/components/common/SavedRatingNotice";

export default function AppointmentReviewForm({ appointment, submitReview, isPending }) {
  if (appointment.status !== "completed") return null;

  const appointmentId = appointment.id || appointment._id;

  if (appointment.reviewSubmitted) {
    return <SavedRatingNotice title="Doctor rated successfully" className="mt-2" />;
  }

  return (
    <div className="pt-2">
      <RatingDialog
        title="Rate Doctor"
        description="Share a quick rating about this appointment."
        loading={isPending}
        onSubmit={(payload) => submitReview(appointmentId, { rating: payload.rating, comment: payload.feedback })}
        trigger={(
          <Button type="button" variant="outline" className="gap-2 rounded-2xl">
            <Star className="h-4 w-4" />
            Rate
          </Button>
        )}
      />
    </div>
  );
}
