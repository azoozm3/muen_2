import { Redirect } from "wouter";
import { useAuth, getRoleDashboardPath } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/common/LoadingScreen";

export function ProtectedRoute({ component: Component, allowedRoles }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/signin" />;
  }

  if (user?.role === "admin") {
    return <Component />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Redirect to={getRoleDashboardPath(user.role)} />;
  }

  return <Component />;
}

export function PublicOnlyRoute({ component: Component }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated && user) {
    return <Redirect to={getRoleDashboardPath(user.role)} />;
  }

  return <Component />;
}
