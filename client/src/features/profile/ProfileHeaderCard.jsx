import { useRef, useState } from "react";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProfileHeaderCard({
  RoleIcon,
  isEditing,
  isSaving,
  onCancel,
  onEdit,
  onSave,
  roleLabel,
  profileImage,
  onImageChange,
}) {
  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState("");

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setImageError("Only PNG, JPG, or WebP images are allowed.");
      return;
    }

    const maxSize = 1.5 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageError("Image must be under 1.5 MB.");
      return;
    }

    setImageError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange?.(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <RoleIcon className="h-5 w-5" />
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold" data-testid="text-profile-title">My Profile</h1>
          <Badge variant="secondary" className="mt-1">{roleLabel}</Badge>
        </div>

        {isEditing && (
          <div className="ml-2 flex flex-col gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleImageSelect}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {profileImage ? "Change photo" : "Upload photo"}
            </Button>
            {profileImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => { setImageError(""); onImageChange?.(null); }}
              >
                Remove photo
              </Button>
            )}
            {imageError && (
              <p className="text-xs text-destructive">{imageError}</p>
            )}
          </div>
        )}
      </div>

      {!isEditing ? (
        <Button onClick={onEdit} className="w-full sm:w-auto" data-testid="button-edit-profile">
          <Pencil className="mr-1 h-4 w-4" /> Edit
        </Button>
      ) : (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Button variant="ghost" onClick={onCancel} className="w-full sm:w-auto" data-testid="button-cancel-edit">
            <X className="mr-1 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={onSave} disabled={isSaving} className="w-full sm:w-auto" data-testid="button-save-profile">
            {isSaving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
            Save
          </Button>
        </div>
      )}
    </div>
  );
}
