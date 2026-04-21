import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export async function readJson(response, fallbackMessage) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || fallbackMessage);
  return payload;
}

export function getRequestId(payload) {
  return payload?.requestId || payload?.id || payload?._id || null;
}

export function ensureRequestId(payload) {
  const requestId = getRequestId(payload);
  if (!requestId) throw new Error("Request id is missing");
  return requestId;
}

export function invalidateEmergencyQueries() {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["/api/requests"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/my/requests"] }),
  ]);
}

export function invalidateSingleRequest(payload) {
  const requestId = getRequestId(payload);
  return requestId ? queryClient.invalidateQueries({ queryKey: ["/api/requests", requestId] }) : Promise.resolve();
}

export function useEmergencyMutation({ buildRequest, fallbackMessage }) {
  return useMutation({
    mutationFn: async (payload) => readJson(await buildRequest(payload), fallbackMessage),
    onSuccess: async (_, variables) => {
      await invalidateEmergencyQueries();
      await invalidateSingleRequest(variables);
    },
  });
}

export async function patchEmergencyRequest(path, body) {
  return apiRequest("PATCH", path, body);
}
