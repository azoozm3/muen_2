import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesktopSidebar, MobileSidebar } from "./admin-shell/AdminShellSidebars";

export function AdminShell({ title = "Admin dashboard", subtitle = "Manage the platform from one place.", sections = [], activeSection = "dashboard", onSectionChange, sidebarCollapsed = false, onToggleSidebar, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const safeSections = Array.isArray(sections) ? sections : [];
  const activeLabel = useMemo(() => safeSections.find((section) => section.key === activeSection)?.label || title, [activeSection, safeSections, title]);

  return (
    <div className="min-h-screen bg-slate-50">
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} sections={safeSections} activeSection={activeSection} onSectionChange={onSectionChange} />

      <div className="flex min-h-screen">
        <DesktopSidebar sections={safeSections} activeSection={activeSection} onSectionChange={onSectionChange} collapsed={sidebarCollapsed} onToggle={onToggleSidebar} />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></Button>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Admin</p>
                  <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
                  <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                </div>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">{activeLabel}</div>
            </div>
          </header>

          <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
