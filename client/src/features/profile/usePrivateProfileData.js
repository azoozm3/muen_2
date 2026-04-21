import { useQuery } from "@tanstack/react-query";
import { useVolunteerRequests } from "@/hooks/use-volunteer-requests";
import { liveQueryOptions } from "@/lib/liveQuery";

function createPrivateQuery(queryKey, endpoint, enabled) {
  return useQuery({
    queryKey,
    enabled,
    queryFn: async () => {
      const res = await fetch(endpoint, { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
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
