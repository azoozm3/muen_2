import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { liveQueryOptions } from "@/lib/liveQuery";

export function useVolunteerRequests() {
  return useQuery({
    queryKey: ["/api/volunteer-requests"],
    ...liveQueryOptions(),
  });
}

function useVolunteerMutation(method, getUrl) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }) => {
      const response = await apiRequest(method, getUrl(id), body);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/volunteer-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/me"] });
    },
  });
}

export function useCreateVolunteerRequest() {
  return useVolunteerMutation("POST", () => "/api/volunteer-requests");
}

export function useAcceptVolunteerRequest() {
  return useVolunteerMutation("PATCH", (id) => `/api/volunteer-requests/${id}/accept`);
}

export function useUpdateVolunteerRequestStatus() {
  return useVolunteerMutation("PATCH", (id) => `/api/volunteer-requests/${id}/status`);
}

export function useCancelVolunteerRequest() {
  return useVolunteerMutation("PATCH", (id) => `/api/volunteer-requests/${id}/cancel`);
}

export function useRateVolunteerRequest() {
  return useVolunteerMutation("POST", (id) => `/api/volunteer-requests/${id}/patient-rating`);
}

export function useRateVolunteerPatient() {
  return useVolunteerMutation("POST", (id) => `/api/volunteer-requests/${id}/volunteer-rating`);
}
