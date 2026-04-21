import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useEditableSyncState } from "@/hooks/use-editable-sync-state";
import { useToast } from "@/hooks/use-toast";
import { liveQueryOptions } from "@/lib/liveQuery";
import { apiRequest } from "@/lib/queryClient";
import { ProfileHeaderCard } from "@/features/profile/ProfileHeaderCard";
import { ProfileRoleSections } from "@/features/profile/ProfileRoleSections";
import { usePrivateProfileData } from "@/features/profile/usePrivateProfileData";
import { buildProfileUpdatePayload, createProfileForm, getBackPath, getRoleIcon } from "@/features/profile/profileUtils";

export default function ProfilePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { data: profile, isLoading } = useQuery({ queryKey: ["/api/profiles/me"], ...liveQueryOptions() });
  const { value: formData, setValue: setFormData, resetValue: resetFormData } = useEditableSyncState(profile, createProfileForm);
  const privateData = usePrivateProfileData(user?.role);

  const updateMutation = useMutation({
    mutationFn: async (data) => (await apiRequest("PATCH", "/api/profiles", data)).json(),
    onSuccess: (updated) => {
      queryClient.setQueryData(["/api/profiles/me"], updated);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      resetFormData(updated);
      setIsEditing(false);
      toast({ title: "Profile updated", description: "Changes saved." });
    },
    onError: (err) => {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const RoleIcon = getRoleIcon(user?.role);
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "";
  const handleSave = () => updateMutation.mutate(buildProfileUpdatePayload(user?.role, formData));
  const handleCancel = () => {
    resetFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="app-page-shell">
      <div className="app-page-container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <ProfileHeaderCard
            RoleIcon={RoleIcon}
            isEditing={isEditing}
            isSaving={updateMutation.isPending}
            onCancel={handleCancel}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            roleLabel={roleLabel}
          />

          <ProfileRoleSections
            {...privateData}
            formData={formData}
            isEditing={isEditing}
            profile={profile}
            setFormData={setFormData}
            userRole={user?.role}
          />
        </motion.div>
      </div>
    </div>
  );
}
