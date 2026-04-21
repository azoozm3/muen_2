import { useEffect } from "react";
import { useCreateRequest, useMyEmergencyRequests, useRequest, useUpdateRequestLocation } from "@/hooks/use-requests";
import { ACTIVE_REQUEST_STORAGE_KEY, CLOSED_REQUEST_STATUSES } from "./patientConstants";
import { useEmergencyActiveRequestId } from "./emergency-hooks/useEmergencyActiveRequestId";
import { usePatientEmergencyForm } from "./emergency-hooks/usePatientEmergencyForm";
import { usePatientGpsTracking } from "./emergency-hooks/usePatientGpsTracking";

export function usePatientEmergency({ user, initialRequestId, toast }) {
  const patientName = user?.name || "Patient";
  const createRequest = useCreateRequest();
  const updateRequestLocation = useUpdateRequestLocation();
  const { data: myEmergencyData } = useMyEmergencyRequests();
  const { activeRequestId, setActiveRequestId } = useEmergencyActiveRequestId(initialRequestId, myEmergencyData);
  const { data: request } = useRequest(activeRequestId);
  const form = usePatientEmergencyForm(patientName);
  const { geoState, hasGpsCoordinates } = usePatientGpsTracking({ activeRequestId, request, form, updateRequestLocation });


  useEffect(() => {
    if (CLOSED_REQUEST_STATUSES.includes(request?.status)) {
      localStorage.removeItem(ACTIVE_REQUEST_STORAGE_KEY);
    }
  }, [request?.status]);

  const submitEmergency = (data) => {
    createRequest.mutate(
      {
        name: data.name || patientName,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        age: 0,
        emergencyType: "Emergency Help",
        description: "",
        urgency: "High",
      },
      {
        onSuccess: (newRequest) => {
          const newId = newRequest.id || newRequest._id;
          setActiveRequestId(newId);
          localStorage.setItem(ACTIVE_REQUEST_STORAGE_KEY, newId);
          toast({ title: "Emergency Alert Sent", description: "Help has been requested. Stay calm." });
        },
        onError: (error) => {
          toast({ title: "Failed to send alert", description: error.message, variant: "destructive" });
        },
      },
    );
  };

  return { form, request, createRequest, geoState, hasGpsCoordinates, activeRequestId, setActiveRequestId, submitEmergency };
}
