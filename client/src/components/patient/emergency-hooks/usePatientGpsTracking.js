import { useEffect, useRef, useState } from "react";
import { CLOSED_REQUEST_STATUSES, GPS_UPDATE_INTERVAL_MS, MOVEMENT_THRESHOLD } from "../patientConstants";
import { formatCoordinateLocation } from "../patientUtils";

export function usePatientGpsTracking({ activeRequestId, request, form, updateRequestLocation }) {
  const [geoState, setGeoState] = useState({ latitude: null, longitude: null, isLocating: false, error: "" });
  const lastSharedRef = useRef({ latitude: null, longitude: null, sentAt: 0 });
  const hasGpsCoordinates = Number.isFinite(geoState.latitude) && Number.isFinite(geoState.longitude);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoState((prev) => ({ ...prev, error: "This browser does not support GPS location.", isLocating: false }));
      return undefined;
    }

    setGeoState((prev) => ({ ...prev, isLocating: true, error: "" }));
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const gpsLabel = formatCoordinateLocation(latitude, longitude);
        setGeoState({ latitude, longitude, isLocating: false, error: "" });
        form.setValue("location", gpsLabel, { shouldValidate: true });
        form.setValue("latitude", latitude);
        form.setValue("longitude", longitude);
      },
      (error) => setGeoState((prev) => ({ ...prev, isLocating: false, error: error.code === 1 ? "Location permission was denied. You can still type your address manually." : "Unable to detect your location right now. You can still type your address manually." })),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [form]);

  useEffect(() => {
    const requestClosed = CLOSED_REQUEST_STATUSES.includes(request?.status);
    if (!activeRequestId || !request || requestClosed) return undefined;
    if (!hasGpsCoordinates) return undefined;

    const maybeShareLocation = () => {
      const last = lastSharedRef.current;
      const moved = !Number.isFinite(last.latitude) || !Number.isFinite(last.longitude)
        || Math.abs(last.latitude - geoState.latitude) > MOVEMENT_THRESHOLD
        || Math.abs(last.longitude - geoState.longitude) > MOVEMENT_THRESHOLD;
      const stale = Date.now() - last.sentAt > GPS_UPDATE_INTERVAL_MS;
      if (!moved && !stale) return;

      lastSharedRef.current = { latitude: geoState.latitude, longitude: geoState.longitude, sentAt: Date.now() };
      updateRequestLocation.mutate({ requestId: activeRequestId, location: formatCoordinateLocation(geoState.latitude, geoState.longitude), latitude: geoState.latitude, longitude: geoState.longitude });
    };

    maybeShareLocation();
    const interval = setInterval(maybeShareLocation, GPS_UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [activeRequestId, geoState.latitude, geoState.longitude, hasGpsCoordinates, request, updateRequestLocation]);

  return { geoState, hasGpsCoordinates };
}
