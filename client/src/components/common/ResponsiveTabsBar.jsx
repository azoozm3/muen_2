import { TabsList } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function ResponsiveTabsBar({ className, listClassName, children, ...props }) {
  return (
    <div className={cn("mb-6 overflow-x-auto pb-1 mobile-scroll-x [&::-webkit-scrollbar]:hidden", className)}>
      <TabsList
        className={cn("grid h-auto min-w-max gap-1 p-1", listClassName)}
        {...props}
      >
        {children}
      </TabsList>
    </div>
  );
}
