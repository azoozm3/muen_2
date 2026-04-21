import { useMemo, useState } from "react";
import { DEFAULT_FORM, getToday } from "./constants";

export function useNurseRequestForm({ toast }) {
  const [form, setForm] = useState(() => ({ ...DEFAULT_FORM, requestedDate: getToday() }));
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const canSubmit = useMemo(
    () => Boolean(form.serviceType && form.requestedDate && form.requestedTime && form.address.trim()),
    [form],
  );

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const resetForm = () => setForm({ ...DEFAULT_FORM, requestedDate: getToday() });

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Location unavailable", description: "This browser cannot share your location.", variant: "destructive" });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords || {};
        setForm((current) => ({ ...current, locationLat: String(latitude || ""), locationLng: String(longitude || ""), location: current.location || "GPS pinned" }));
        toast({ title: "Location added", description: "Your live location pin was attached." });
        setIsGettingLocation(false);
      },
      (error) => {
        toast({ title: "Location failed", description: error?.code === 1 ? "Location permission was denied." : "Could not read your location right now.", variant: "destructive" });
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  return { form, canSubmit, isGettingLocation, updateField, resetForm, handleUseCurrentLocation };
}
