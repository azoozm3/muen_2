import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { getProfilePath } from "@/features/profile/public/publicProfilePaths";

export function ProfileLink({ id, role = "provider", children, className = "", fallback = null }) {
  if (!id) {
    return fallback || <span className={className}>{children}</span>;
  }

  const href = getProfilePath(id, role);
  return (
    <Link href={href} className={cn("text-primary hover:underline underline-offset-4", className)}>
      {children}
    </Link>
  );
}
