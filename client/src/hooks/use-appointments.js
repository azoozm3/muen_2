import { useQuery } from "@tanstack/react-query";
import { liveQueryOptions } from "@/lib/liveQuery";
import { fetchJson } from "@/lib/queryClient";

async function fetchAppointments(url) {
  return fetchJson(url, "Failed to fetch appointments");
}

export function usePatientAppointments() {
  return useQuery({
    queryKey: ["/api/appointments", "patient"],
    queryFn: () => fetchAppointments("/api/appointments"),
    ...liveQueryOptions(),
  });
}

export function useDoctorAppointments() {
  return useQuery({
    queryKey: ["/api/appointments", "doctor"],
    queryFn: () => fetchAppointments("/api/appointments"),
    ...liveQueryOptions(),
  });
}
