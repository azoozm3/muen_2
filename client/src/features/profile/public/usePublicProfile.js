import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { readPublicProfileRoute } from "@/features/profile/public/publicProfilePaths";

export function usePublicProfile(expectedRole) {
  const [location] = useLocation();
  const { id: profileId, routeRole } = useMemo(() => readPublicProfileRoute(location), [location]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/profiles/${profileId}`, { credentials: "include" });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Failed to load profile");
        }

        if (isMounted) setData(result);
      } catch (loadError) {
        console.error("Public profile load error:", loadError);
        if (isMounted) {
          setData(null);
          setError(loadError.message || "Failed to load profile");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (profileId) loadProfile();
    else {
      setData(null);
      setError("Profile not found");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [profileId]);

  return {
    data,
    error,
    isLoading,
    profileId,
    routeRole,
    resolvedRole: String(data?.role || expectedRole || routeRole || "provider").toLowerCase(),
  };
}
