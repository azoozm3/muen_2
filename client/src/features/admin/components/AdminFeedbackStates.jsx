import { Loader2 } from "lucide-react";

export function AdminLoadingState() {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border bg-card shadow-sm">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function AdminErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-destructive">Admin error</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message || "Please refresh and try again."}</p>
    </div>
  );
}
