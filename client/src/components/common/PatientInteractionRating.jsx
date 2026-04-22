import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingDialog } from "@/components/common/RatingDialog";
import { SavedRatingNotice } from "@/components/common/SavedRatingNotice";

export function PatientInteractionRating({
  existingRating,
  existingFeedback,
  onSave,
  isPending = false,
  title = "Rate Patient",
  description = "Add a quick rating about this patient.",
  buttonLabel = "Rate",
  savedTitle = "Patient rated successfully",
}) {
  if (existingRating) {
    return <SavedRatingNotice title={savedTitle} rating={existingRating} feedback={existingFeedback} />;
  }

  return (
    <RatingDialog
      title={title}
      description={description}
      loading={isPending}
      onSubmit={onSave}
      trigger={(
        <Button type="button" variant="outline" className="gap-2 rounded-2xl">
          <Star className="h-4 w-4" />
          {buttonLabel}
        </Button>
      )}
    />
  );
}
