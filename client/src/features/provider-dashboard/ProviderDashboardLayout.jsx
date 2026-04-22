import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveTabsBar } from "@/components/common/ResponsiveTabsBar";

export function ProviderDashboardShell({ children }) {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">{children}</div>
    </div>
  );
}

export function ProviderDashboardHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function ProviderHeaderAction({ onClick, icon: Icon, children, variant = "outline", disabled = false }) {
  return (
    <Button variant={variant} className="w-full sm:w-auto" onClick={onClick} disabled={disabled}>
      {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
      {children}
    </Button>
  );
}

export function ProviderInfoBanner({ icon: Icon, title, description }) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function ProviderDashboardTabs({ value, defaultValue, onValueChange, tabs, children }) {
  return (
    <Tabs value={value} defaultValue={defaultValue} onValueChange={onValueChange} className="w-full">
      <ResponsiveTabsBar listClassName="w-full min-w-[520px] grid-cols-3 gap-1 bg-muted p-1">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="min-h-10 whitespace-normal break-words px-2 py-2 text-[11px] sm:px-3 sm:text-sm"
          >
            {tab.label}
            {typeof tab.count === "number" ? ` (${tab.count})` : ""}
          </TabsTrigger>
        ))}
      </ResponsiveTabsBar>
      {children}
    </Tabs>
  );
}

export function ProviderDashboardTabPanel({ value, className = "space-y-4", children }) {
  return (
    <TabsContent value={value} className={className}>
      {children}
    </TabsContent>
  );
}
