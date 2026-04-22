import { Button } from "@/components/ui/button";

export default function AppointmentsHeader({ title, description, userLabel, onProfileClick, ProfileIcon }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border bg-white px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
          {userLabel}
        </span>
        <Button variant="outline" onClick={onProfileClick}>
          <ProfileIcon className="mr-2 h-4 w-4" />
          Profile
        </Button>
      </div>
    </div>
  );
}
