import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useProviderPatientRating } from "@/features/provider-dashboard/useProviderPatientRating";

async function refreshAppointments() {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["/api/appointments"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/appointments", "doctor"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/appointments", "patient"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/profiles/me"] }),
  ]);
}

export function useDoctorAppointmentActions() {
  const { toast } = useToast();
  const savePatientRating = useProviderPatientRating({ queryKey: ["/api/appointments"], successTitle: "Patient rating saved", errorTitle: "Could not save patient rating" });
  const [detailsForm, setDetailsForm] = useState({});
  const [summaryText, setSummaryText] = useState({});
  const [prescriptionRows, setPrescriptionRows] = useState({});

  const respondMutation = useMutation({
    mutationFn: async ({ id, action }) => (await apiRequest("PATCH", `/api/appointments/${id}/respond`, { action })).json(),
    onSuccess: async (_, variables) => {
      await refreshAppointments();
      toast({ title: variables.action === "confirmed" ? "Appointment accepted" : "Appointment rejected" });
    },
    onError: (error) => toast({ title: "Action failed", description: error.message, variant: "destructive" }),
  });

  const completeMutation = useMutation({
    mutationFn: async ({ id }) => (await apiRequest("PATCH", `/api/appointments/${id}/status`, { status: "completed" })).json(),
    onSuccess: async () => {
      await refreshAppointments();
      toast({ title: "Appointment marked as completed" });
    },
    onError: (error) => toast({ title: "Could not update appointment", description: error.message, variant: "destructive" }),
  });

  const saveDetailsMutation = useMutation({
    mutationFn: async ({ id, consultationSummary, prescription }) => (await apiRequest("PATCH", `/api/appointments/${id}/notes`, { consultationSummary, prescription })).json(),
    onSuccess: async (_, variables) => {
      setDetailsForm((prev) => ({ ...prev, [variables.id]: false }));
      await refreshAppointments();
      toast({ title: "Clinical details saved" });
    },
    onError: (error) => toast({ title: "Could not save details", description: error.message, variant: "destructive" }),
  });

  const ratePatientMutation = useMutation({
    mutationFn: async ({ appointment, payload }) => savePatientRating({
      patientId: appointment.patientId,
      interactionType: "appointment",
      interactionId: appointment.id || appointment._id,
      rating: payload.rating,
      feedback: payload.feedback || "",
    }),
  });

  return {
    detailsState: { detailsForm, setDetailsForm, summaryText, setSummaryText, prescriptionRows, setPrescriptionRows },
    respondMutation,
    completeMutation,
    saveDetailsMutation,
    ratePatientMutation,
  };
}
