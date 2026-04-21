import { useQuery } from "@tanstack/react-query";
import { useVolunteerRequests } from "@/hooks/use-volunteer-requests";
import { liveQueryOptions } from "@/lib/liveQuery";
import { fetchJson } from "@/lib/queryClient";

function createPrivateQuery(queryKey, endpoint, enabled) {
  return useQuery({
    queryKey,
    enabled,
    queryFn: async () => {
      try {
        return await fetchJson(endpoint, `Failed to load ${endpoint}`);
      } catch {
        return [];
      }
    },
    ...liveQueryOptions(),
  });
}

export function usePrivateProfileData(userRole) {
  const enabled = userRole === "patient";
  const { data: privateAppointments = [] } = createPrivateQuery(["/api/appointments", "profile-private"], "/api/appointments", enabled);
  const { data: privateEmergencyRequests = [] } = createPrivateQuery(["/api/my/requests", "profile-private"], "/api/my/requests", enabled);
  const { data: privateNurseRequests = [] } = createPrivateQuery(["/api/nurse-requests", "profile-private"], "/api/nurse-requests", enabled);
  const { data: volunteerRequests = [] } = useVolunteerRequests();

  return {
    privateAppointments,
    privateEmergencyRequests,
    privateNurseRequests,
    volunteerRequests,
  };
}
