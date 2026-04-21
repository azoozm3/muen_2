import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { liveQueryOptions } from "@/lib/liveQuery";
import { ensureRequestId, patchEmergencyRequest, readJson, useEmergencyMutation } from "./requestMutationHelpers";

const ALL_REQUESTS_KEY = ["/api/requests"];
const MY_REQUESTS_KEY = ["/api/my/requests"];

export function useAllRequests() {
  return useQuery({ queryKey: ALL_REQUESTS_KEY, ...liveQueryOptions() });
}

export function useMyRequests() {
  return useQuery({ queryKey: MY_REQUESTS_KEY, ...liveQueryOptions() });
}

export const useMyEmergencyRequests = useMyRequests;
export const useUpdateStatus = useUpdateRequestStatus;
export const useRequests = useAllRequests;

export function useRequest(requestId) {
  return useQuery({
    queryKey: ["/api/requests", requestId],
    enabled: !!requestId,
    queryFn: async () => readJson(await fetch(`/api/requests/${requestId}`, { credentials: "include" }), "Failed to load request"),
    ...liveQueryOptions(),
  });
}

export function useCreateRequest() {
  return useEmergencyMutation({
    fallbackMessage: "Failed to create request",
    buildRequest: (payload) => apiRequest("POST", "/api/requests", payload),
  });
}

export function useUpdateRequestStatus() {
  return useEmergencyMutation({
    fallbackMessage: "Failed to update request status",
    buildRequest: ({ status, ...payload }) => patchEmergencyRequest(`/api/requests/${ensureRequestId(payload)}/status`, { status }),
  });
}

export function useUpdateRequestLocation() {
  return useEmergencyMutation({
    fallbackMessage: "Failed to update request location",
    buildRequest: ({ location, latitude, longitude, ...payload }) => patchEmergencyRequest(`/api/requests/${ensureRequestId(payload)}/location`, { location, latitude, longitude }),
  });
}

export function useUpdateResponderLocation() {
  return useEmergencyMutation({
    fallbackMessage: "Failed to update responder location",
    buildRequest: ({ latitude, longitude, ...payload }) => patchEmergencyRequest(`/api/requests/${ensureRequestId(payload)}/responder-location`, { latitude, longitude }),
  });
}
