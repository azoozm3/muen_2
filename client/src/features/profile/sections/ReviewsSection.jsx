import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ProfileSectionCard, RatingList } from "./ProfileSectionShared";

export function ReviewsSection({ reviews }) {
  return (
    <ProfileSectionCard icon={Star} title="My Ratings">
      <div className="mb-4">
        <Label className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Rating History</Label>
        <p className="mt-1 text-xs text-muted-foreground">{reviews.length} rating(s)</p>
      </div>
      <div className="space-y-3"><RatingList items={reviews} /></div>
    </ProfileSectionCard>
  );
}
