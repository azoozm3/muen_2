import { Loader2 } from "lucide-react";

export function LoadingScreen({ className = "min-h-[60vh]" }) {
  return (
    <div className={`flex ${className} items-center justify-center`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
