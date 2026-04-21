import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth/RouteGuards";
import { publicRoutes, protectedRoutes } from "@/routes/routeConfig";
import NotFound from "@/pages/not-found";

function AppRouter() {
  return (
    <Switch>
      {publicRoutes.map(({ path, component }) => (
        <Route
          key={path}
          path={path}
          component={() => <PublicOnlyRoute component={component} />}
        />
      ))}

      {protectedRoutes.map(({ path, component, allowedRoles }) => (
        <Route
          key={path}
          path={path}
          component={() => (
            <ProtectedRoute component={component} allowedRoles={allowedRoles} />
          )}
        />
      ))}

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen overflow-x-hidden bg-background font-sans antialiased selection:bg-primary/20">
          <Navbar />
          <AppRouter />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
