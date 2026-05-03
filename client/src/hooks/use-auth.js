import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, updateCsrfToken } from "@/lib/queryClient";
import { staticQueryOptions } from "@/lib/liveQuery";

export function getRoleDashboardPath(role) {
  if (role === "doctor") return "/dashboard/doctor";
  if (role === "nurse") return "/dashboard/nurse";
  if (role === "volunteer") return "/dashboard/volunteer";
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/patient/services";
}

export function useAuth() {
  const queryClient = useQueryClient();

  const authQuery = useQuery({
    queryKey: ["/api/auth/me"],
    staleTime: Infinity,
    ...staticQueryOptions(),
  });

  const signInMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await apiRequest("POST", "/api/auth/signin", credentials);
      return response.json();
    },
    onSuccess: (user) => {
      updateCsrfToken(user?.csrfToken);
      queryClient.setQueryData(["/api/auth/me"], user);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await apiRequest("POST", "/api/auth/signup", payload);
      return response.json();
    },
    onSuccess: (user) => {
      updateCsrfToken(user?.csrfToken);
      queryClient.setQueryData(["/api/auth/me"], user);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/signout");
      return response.json();
    },
    onSuccess: () => {
      updateCsrfToken(null);
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.clear();
      queryClient.setQueryData(["/api/auth/me"], null);
    },
  });

  return {
    user: authQuery.data,
    isLoading: authQuery.isLoading,
    isAuthenticated: !!authQuery.data,
    error: authQuery.error,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
  };
}
