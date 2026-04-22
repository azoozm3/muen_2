import { Shield } from "lucide-react";
import { ProfileSectionCard } from "./ProfileSectionShared";

export function AdminDetailsSection({ profile }) {
  return (
    <ProfileSectionCard icon={Shield} title="Admin Details">
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Account ID: {profile?.id || profile?._id || "N/A"}</p>
        <p>Role: {profile?.role || "Admin"}</p>
      </div>
    </ProfileSectionCard>
  );
}
