import { useEffect, useRef, useState } from "react";
import { useUpdateResponderLocation } from "@/hooks/use-requests";
import { ACTIVE_TRACKING_STATUSES, MOVEMENT_THRESHOLD, SHARE_INTERVAL_MS } from "./constants";

export function useDoctorGpsSharing(request) {
  const updateResponderLocation = useUpdateResponderLocation();
  const lastSharedRef = useRef({ latitude: null, longitude: null, sentAt: 0 });
  const [geoState, setGeoState] = useState({ latitude: null, longitude: null, error: "" });

  useEffect(() => {
    if (!ACTIVE_TRACKING_STATUSES.includes(request.status)) return undefined;
    if (!navigator.geolocation) {
      setGeoState((prev) => ({ ...prev, error: "Live GPS is not supported in this browser." }));
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => setGeoState({ latitude: position.coords.latitude, longitude: position.coords.longitude, error: "" }),
      (error) => setGeoState((prev) => ({ ...prev, error: error?.code === 1 ? "Allow location access so the patient can follow your route." : "Unable to read your current location." })),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [request.status]);

  useEffect(() => {
    if (!ACTIVE_TRACKING_STATUSES.includes(request.status)) return undefined;
    if (!Number.isFinite(geoState.latitude) || !Number.isFinite(geoState.longitude)) return undefined;

    const maybeShareLocation = () => {
      const last = lastSharedRef.current;
      const moved = !Number.isFinite(last.latitude) || !Number.isFinite(last.longitude)
        || Math.abs(last.latitude - geoState.latitude) > MOVEMENT_THRESHOLD
        || Math.abs(last.longitude - geoState.longitude) > MOVEMENT_THRESHOLD;
      const stale = Date.now() - last.sentAt > SHARE_INTERVAL_MS;
      if (!moved && !stale) return;

      lastSharedRef.current = { latitude: geoState.latitude, longitude: geoState.longitude, sentAt: Date.now() };
      updateResponderLocation.mutate({ requestId: request.id || request._id, latitude: geoState.latitude, longitude: geoState.longitude });
    };

    maybeShareLocation();
    const interval = setInterval(maybeShareLocation, SHARE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [geoState.latitude, geoState.longitude, request.id, request._id, request.status, updateResponderLocation]);

  return geoState;
}
