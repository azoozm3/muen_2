import { useQuery } from "@tanstack/react-query";
import { liveQueryOptions } from "@/lib/liveQuery";

async function fetchAppointments(url) {
  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || "Failed to fetch appointments");
  }

  return response.json();
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
