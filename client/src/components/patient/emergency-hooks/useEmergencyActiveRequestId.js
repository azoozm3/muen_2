import { useEffect, useState } from "react";
import { ACTIVE_REQUEST_STORAGE_KEY } from "../patientConstants";

export function useEmergencyActiveRequestId(initialRequestId, myEmergencyData) {
  const [activeRequestId, setActiveRequestId] = useState(initialRequestId || null);

  useEffect(() => {
    const serverRequestId = myEmergencyData?.activeRequest?.id || myEmergencyData?.activeRequest?._id || null;
    if (!activeRequestId && serverRequestId) {
      setActiveRequestId(serverRequestId);
    }
  }, [activeRequestId, myEmergencyData]);

  useEffect(() => {
    if (!activeRequestId) {
      localStorage.removeItem(ACTIVE_REQUEST_STORAGE_KEY);
      return;
    }
    localStorage.setItem(ACTIVE_REQUEST_STORAGE_KEY, activeRequestId);
  }, [activeRequestId]);

  useEffect(() => {
    if (initialRequestId) return;
    const savedId = localStorage.getItem(ACTIVE_REQUEST_STORAGE_KEY);
    if (savedId) {
      setActiveRequestId((current) => current || savedId);
    }
  }, [initialRequestId]);

  return { activeRequestId, setActiveRequestId };
}
