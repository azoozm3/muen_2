import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MapHeader({ title, description, openUrl }) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description || "GPS locations update automatically while both sides keep this page open."}</p>
      </div>
      {openUrl ? <Button asChild size="sm" variant="outline"><a href={openUrl} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" /> Open</a></Button> : null}
    </div>
  );
}
