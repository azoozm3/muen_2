import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNav({ sections = [], activeSection, onSelect, compact = false }) {
  return (
    <div className="space-y-1">
      {sections.map((section) => {
        const Icon = section.icon || Shield;
        const isActive = section.key === activeSection;

        return (
          <button
            key={section.key}
            type="button"
            onClick={() => onSelect?.(section.key)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition",
              compact && "justify-center px-2",
              isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
            title={compact ? section.label : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!compact ? <span className="truncate">{section.label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
