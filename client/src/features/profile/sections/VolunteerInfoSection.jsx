import { HeartHandshake, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileSectionCard, StarRating } from "./common";

export function VolunteerInfoSection({ isEditing, profile, formData, setFormData }) {
  return (
    <ProfileSectionCard icon={HeartHandshake} title="Volunteer Info">
      <div className="space-y-4">
        <div>
          <Label>Area</Label>
          {isEditing ? (
            <Input value={formData.volunteerCoverageArea || ""} onChange={(e) => setFormData((prev) => ({ ...prev, volunteerCoverageArea: e.target.value }))} placeholder="City or area" />
          ) : <p className="mt-1 text-sm">{profile?.volunteerCoverageArea || profile?.address || "Not set"}</p>}
        </div>
        <div>
          <Label className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Rating</Label>
          <StarRating rating={profile?.rating} />
        </div>
        <p className="text-xs text-muted-foreground">Volunteer profiles are simplified here. Extra volunteer fields can still remain stored safely in the database.</p>
      </div>
    </ProfileSectionCard>
  );
}
