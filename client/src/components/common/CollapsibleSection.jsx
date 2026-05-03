import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function CollapsibleSection({ title, icon: Icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2 text-lg font-semibold">
          {Icon ? <Icon className="h-5 w-5 text-muted-foreground" /> : null}
          {title}
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
