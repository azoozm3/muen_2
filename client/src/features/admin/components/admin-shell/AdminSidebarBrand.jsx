import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebarBrand({ collapsed = false }) {
  return (
    <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center")}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Shield className="h-5 w-5" />
      </div>
      {!collapsed ? (
        <div>
          <p className="text-sm font-semibold text-slate-900">Admin panel</p>
          <p className="text-xs text-slate-500">Control center</p>
        </div>
      ) : null}
    </div>
  );
}
