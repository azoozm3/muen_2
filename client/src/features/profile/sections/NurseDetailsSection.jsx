import { Award, Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProfileSectionCard, StarRating } from "./common";

export function NurseDetailsSection({ isEditing, profile, formData, setFormData }) {
  return (
    <ProfileSectionCard icon={Award} title="Professional Details">
      <div className="space-y-4">
        <div>
          <Label>Bio / Description</Label>
          {isEditing ? (
            <Textarea value={formData.bio} onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))} placeholder="Describe your nursing experience and specializations" className="min-h-[100px]" data-testid="input-profile-bio" />
          ) : <p className="mt-1 whitespace-pre-wrap text-sm" data-testid="text-profile-bio">{profile?.bio || "Not set"}</p>}
        </div>
        <div>
          <Label className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Rating</Label>
          <StarRating rating={profile?.rating} />
        </div>
      </div>
    </ProfileSectionCard>
  );
}
