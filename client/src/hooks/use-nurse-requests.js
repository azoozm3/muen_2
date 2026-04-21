import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { liveQueryOptions } from "@/lib/liveQuery";
import { normalizeNurseRequests } from "@/features/nurse-requests/shared/requestStatus";

const QUERY_KEY = ["/api/nurse-requests"];

async function readJson(response, fallbackMessage) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) throw new Error(data?.message || fallbackMessage);
  return data;
}

function invalidateNurseRequests() {
  return queryClient.invalidateQueries({ queryKey: QUERY_KEY });
}

export function useNurseRequests() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await fetch("/api/nurse-requests", { credentials: "include" });
      return readJson(response, "Failed to fetch nurse requests");
    },
    select: normalizeNurseRequests,
    ...liveQueryOptions(),
  });
}

export function useCreateNurseRequest() {
  return useMutation({
    mutationFn: async (payload) => readJson(await apiRequest("POST", "/api/nurse-requests", payload), "Failed to create nurse request"),
    onSuccess: invalidateNurseRequests,
  });
}

export function useRespondToNurseRequest() {
  return useMutation({
    mutationFn: async ({ id, action }) => readJson(await apiRequest("PATCH", `/api/nurse-requests/${id}/respond`, { action }), "Failed to update nurse request"),
    onSuccess: invalidateNurseRequests,
  });
}

export function useCancelNurseRequest() {
  return useMutation({
    mutationFn: async ({ id }) => readJson(await apiRequest("PATCH", `/api/nurse-requests/${id}/cancel`), "Failed to cancel nurse request"),
    onSuccess: invalidateNurseRequests,
  });
}

export function useUpdateNurseRequestStatus() {
  return useMutation({
    mutationFn: async ({ id, status }) => readJson(await apiRequest("PATCH", `/api/nurse-requests/${id}/status`, { status }), "Failed to update nurse request status"),
    onSuccess: invalidateNurseRequests,
  });
}

export function useRequestNurseReassignment() {
  return useMutation({
    mutationFn: async ({ id, reason }) => readJson(await apiRequest("PATCH", `/api/nurse-requests/${id}/reassign`, { reason }), "Failed to request reassignment"),
    onSuccess: invalidateNurseRequests,
  });
}

export function useSaveNurseVisitReport() {
  return useMutation({
    mutationFn: async ({ id, ...payload }) => readJson(await apiRequest("PATCH", `/api/nurse-requests/${id}/report`, payload), "Failed to save nurse visit report"),
    onSuccess: invalidateNurseRequests,
  });
}

export function useRateNurseRequest() {
  return useMutation({
    mutationFn: async ({ id, rating, comment }) => readJson(await apiRequest("POST", `/api/nurse-requests/${id}/review`, { rating, feedback: comment }), "Failed to save rating"),
    onSuccess: invalidateNurseRequests,
  });
}
