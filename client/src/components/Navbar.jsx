import { Link, useLocation } from "wouter";
import { LogOut, Loader2, Shield, ArrowLeft, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, getRoleDashboardPath } from "@/hooks/use-auth";

export function Navbar() {
  const [location, navigate] = useLocation();
  const { user, isLoading, isAuthenticated, signOut, signOutPending } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const isAdminViewingOtherRole =
    user?.role === "admin" &&
    location.startsWith("/dashboard/") &&
    !location.startsWith("/dashboard/admin");

  const homePath =
    user?.role === "patient"
      ? "/dashboard/patient"
      : user?.role === "doctor"
        ? "/dashboard/doctor"
        : user?.role === "nurse"
          ? "/dashboard/nurse"
          : user?.role === "admin"
            ? "/dashboard/admin"
            : "/";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(homePath)}
          className="group flex min-w-0 items-center gap-3 rounded-2xl"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 ring-1 ring-primary/10 transition-colors group-hover:bg-primary/5">
            <img src="/favicon.png" alt="mu'en logo" className="h-9 w-9 object-contain" />
          </div>
          <span className="truncate text-lg font-bold tracking-tight sm:text-xl">
            mu&apos;<span className="text-primary">en</span>
          </span>
        </button>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : isAuthenticated && user ? (
            <>
              {isAdminViewingOtherRole && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-xl px-3"
                  onClick={() => navigate("/dashboard/admin")}
                  data-testid="button-back-admin"
                >
                  <ArrowLeft className="h-4 w-4 sm:mr-1" />
                  <Shield className="hidden h-4 w-4 sm:mr-1 sm:block" />
                  <span className="hidden sm:inline">Back to Admin</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-10 max-w-[9.5rem] rounded-xl px-2.5 sm:px-3"
                onClick={() => navigate("/profile")}
                data-testid="button-nav-profile"
              >
                <UserCircle className="h-4 w-4 shrink-0 sm:mr-1" />
                <span className="hidden truncate sm:inline">{user.name}</span>
              </Button>
              {user.role === "admin" && !isAdminViewingOtherRole && (
                <Badge variant="destructive" className="hidden text-xs sm:inline-flex">
                  <Shield className="mr-1 h-3 w-3" /> Admin
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-10 rounded-xl px-2.5 sm:px-3"
                onClick={handleSignOut}
                disabled={signOutPending}
                data-testid="button-signout"
              >
                <LogOut className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" size="sm" className="h-10 rounded-xl px-3" data-testid="nav-signin">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="h-10 rounded-xl px-3" data-testid="nav-signup">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
