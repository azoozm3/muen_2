import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ProfileSectionCard, RatingList, StarRating } from "./common";

export function PatientRatingSummarySection({ profile }) {
  const ratings = Array.isArray(profile?.patientRatings) ? profile.patientRatings : [];

  return (
    <ProfileSectionCard icon={Star} title="My Rating">
      <div className="mb-4">
        <Label className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Overall Patient Rating</Label>
        <StarRating rating={profile?.patientRating} />
        <p className="mt-1 text-xs text-muted-foreground">{profile?.patientRatingCount || 0} rating(s)</p>
      </div>
      <div className="space-y-3"><RatingList items={ratings} labelKey="providerRole" commentKey="feedback" /></div>
    </ProfileSectionCard>
  );
}
