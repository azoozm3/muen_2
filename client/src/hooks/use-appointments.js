import { useQuery } from "@tanstack/react-query";
import { liveQueryOptions } from "@/lib/liveQuery";
import { fetchJson } from "@/lib/queryClient";

const APPOINTMENTS_KEY = ["/api/appointments"];

async function fetchAppointments() {
  return fetchJson("/api/appointments", "Failed to fetch appointments");
}

export function usePatientAppointments() {
  return useQuery({
    queryKey: APPOINTMENTS_KEY,
    queryFn: fetchAppointments,
    ...liveQueryOptions(),
  });
}

export function useDoctorAppointments() {
  return useQuery({
    queryKey: APPOINTMENTS_KEY,
    queryFn: fetchAppointments,
    ...liveQueryOptions(),
  });
}
