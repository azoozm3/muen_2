import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

async function refreshAppointments() {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["/api/appointments"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/appointments", "patient"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/reviews"] }),
    queryClient.invalidateQueries({ queryKey: ["/api/profiles/me"] }),
  ]);
}

export function usePatientAppointmentActions() {
  const { toast } = useToast();
  const [reviewForm, setReviewForm] = useState({});
  const [rating, setRating] = useState({});
  const [comment, setComment] = useState({});

  const cancelMutation = useMutation({
    mutationFn: async (appointmentId) => (await apiRequest("PATCH", `/api/appointments/${appointmentId}/cancel`, {})).json(),
    onSuccess: async () => {
      await refreshAppointments();
      toast({ title: "Appointment cancelled" });
    },
    onError: (error) => toast({ title: "Could not cancel appointment", description: error.message, variant: "destructive" }),
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ appointmentId, payload }) => (await apiRequest("POST", `/api/appointments/${appointmentId}/review`, payload)).json(),
    onSuccess: async (_, variables) => {
      setReviewForm((prev) => ({ ...prev, [variables.appointmentId]: false }));
      await refreshAppointments();
      toast({ title: "Doctor review submitted" });
    },
    onError: (error) => toast({ title: "Could not submit review", description: error.message, variant: "destructive" }),
  });

  return {
    reviewProps: { reviewForm, setReviewForm, rating, setRating, comment, setComment, isPending: reviewMutation.isPending },
    cancelMutation,
    reviewMutation,
  };
}
