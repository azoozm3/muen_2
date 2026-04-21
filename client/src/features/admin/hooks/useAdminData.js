import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { liveQueryOptions } from "@/lib/liveQuery";

async function fetchJson(url) {
  const response = await fetch(url, { credentials: "include" });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || `Failed to load ${url}`);
  }

  return payload;
}

const createAdminQuery = (key, url, extras = {}) => ({
  queryKey: key,
  queryFn: () => fetchJson(url),
  ...liveQueryOptions(),
  ...extras,
});

export function useAdminDashboard() {
  return useQuery(createAdminQuery(["/api/admin/dashboard"], "/api/admin/dashboard"));
}

export function useAdminUsers(role = "all") {
  const query = role && role !== "all" ? `?role=${encodeURIComponent(role)}` : "";
  return useQuery(createAdminQuery(["/api/admin/users", role], `/api/admin/users${query}`));
}

export function useAdminRequests() {
  return useQuery(createAdminQuery(["/api/admin/requests"], "/api/admin/requests"));
}

export function useAdminAppointments() {
  return useQuery(createAdminQuery(["/api/admin/appointments"], "/api/admin/appointments"));
}

export function useAdminPayments() {
  return useQuery(createAdminQuery(["/api/admin/payments"], "/api/admin/payments"));
}

export function useAdminAnalytics() {
  return useQuery(createAdminQuery(["/api/admin/analytics"], "/api/admin/analytics"));
}

export function useAdminSettings() {
  return useQuery(createAdminQuery(["/api/admin/settings"], "/api/admin/settings"));
}

function invalidateAdminQueries() {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/admin/requests"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] }),
  ]);
}

export function useUpdateAdminSettings() {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiRequest("PATCH", "/api/admin/settings", payload);
      return response.json();
    },
    onSuccess: invalidateAdminQueries,
  });
}

export function useUpdateAdminUser() {
  return useMutation({
    mutationFn: async ({ userId, id, ...payload }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId || id}`, payload);
      return response.json();
    },
    onSuccess: invalidateAdminQueries,
  });
}

export function useDeleteAdminUser() {
  return useMutation({
    mutationFn: async (userId) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return response.json();
    },
    onSuccess: invalidateAdminQueries,
  });
}

export function useMarkProviderPaid() {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiRequest("POST", "/api/admin/payments/mark-provider-paid", payload);
      return response.json();
    },
    onSuccess: invalidateAdminQueries,
  });
}
