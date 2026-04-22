import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminNav } from "./AdminNav";
import { AdminSidebarBrand } from "./AdminSidebarBrand";

export function DesktopSidebar({ sections, activeSection, onSectionChange, collapsed, onToggle }) {
  return (
    <aside className={cn("hidden border-r border-slate-200 bg-white/80 backdrop-blur lg:flex lg:flex-col", collapsed ? "lg:w-[88px]" : "lg:w-[280px]")}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4">
        <AdminSidebarBrand collapsed={collapsed} />
        <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0">{collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}</Button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4"><AdminNav sections={sections} activeSection={activeSection} onSelect={onSectionChange} compact={collapsed} /></div>
    </aside>
  );
}

export function MobileSidebar({ open, onClose, sections, activeSection, onSectionChange }) {
  if (!open) return null;

  const handleSelect = (key) => {
    onSectionChange?.(key);
    onClose?.();
  };

  return (
    <>
      <button type="button" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={onClose} aria-label="Close admin menu" />
      <aside className="fixed inset-y-0 left-0 z-40 w-[300px] border-r border-slate-200 bg-white shadow-xl lg:hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <AdminSidebarBrand />
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="h-[calc(100vh-73px)] overflow-y-auto px-3 py-4"><AdminNav sections={sections} activeSection={activeSection} onSelect={handleSelect} /></div>
      </aside>
    </>
  );
}
