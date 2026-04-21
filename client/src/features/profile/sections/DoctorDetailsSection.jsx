import { Star, Stethoscope } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { specialties } from "@shared/schema";
import { ProfileSectionCard, StarRating } from "./common";

export function DoctorDetailsSection({ isEditing, profile, formData, setFormData }) {
  return (
    <ProfileSectionCard icon={Stethoscope} title="Professional Details">
      <div className="space-y-4">
        <div>
          <Label>Specialty</Label>
          {isEditing ? (
            <Select value={formData.specialty} onValueChange={(value) => setFormData((prev) => ({ ...prev, specialty: value }))}>
              <SelectTrigger data-testid="select-profile-specialty"><SelectValue placeholder="Select specialty" /></SelectTrigger>
              <SelectContent>{specialties.map((specialty) => <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>)}</SelectContent>
            </Select>
          ) : <p className="mt-1 text-sm" data-testid="text-profile-specialty">{profile?.specialty || "Not set"}</p>}
        </div>

        <div>
          <Label>Bio / Description</Label>
          {isEditing ? (
            <Textarea value={formData.bio} onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))} placeholder="Describe your experience and areas of expertise" className="min-h-[100px]" data-testid="input-profile-bio" />
          ) : <p className="mt-1 whitespace-pre-wrap text-sm" data-testid="text-profile-bio">{profile?.bio || "Not set"}</p>}
        </div>

        <div>
          <Label>Online consultation</Label>
          {isEditing ? (
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!formData.onlineConsultation} onChange={(e) => setFormData((prev) => ({ ...prev, onlineConsultation: e.target.checked }))} />
              Enable online consultation requests
            </label>
          ) : <p className="mt-1 text-sm" data-testid="text-profile-online-consultation">{profile?.onlineConsultation ? "Available" : "Not available"}</p>}
        </div>

        <div>
          <Label className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Rating</Label>
          <StarRating rating={profile?.rating} />
        </div>
      </div>
    </ProfileSectionCard>
  );
}
