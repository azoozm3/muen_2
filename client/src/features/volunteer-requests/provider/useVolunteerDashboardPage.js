import { useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAcceptVolunteerRequest, useRateVolunteerPatient, useUpdateVolunteerRequestStatus, useVolunteerRequests } from "@/hooks/use-volunteer-requests";

export function useVolunteerDashboardPage(userId) {
  const { toast } = useToast();
  const { data = [], isLoading } = useVolunteerRequests();
  const acceptMutation = useAcceptVolunteerRequest();
  const statusMutation = useUpdateVolunteerRequestStatus();
  const rateMutation = useRateVolunteerPatient();

  const available = useMemo(() => data.filter((item) => item.status === "pending"), [data]);
  const active = useMemo(() => data.filter((item) => String(item.volunteerId) === String(userId) && ["accepted", "in_progress"].includes(item.status)), [data, userId]);
  const history = useMemo(() => data.filter((item) => String(item.volunteerId) === String(userId) && ["completed", "cancelled"].includes(item.status)), [data, userId]);

  async function withToast(action, successTitle, failureTitle) {
    try {
      const result = await action();
      toast({ title: successTitle });
      return result;
    } catch (error) {
      toast({ title: failureTitle, description: error.message, variant: "destructive" });
      throw error;
    }
  }

  return {
    isLoading,
    available,
    active,
    history,
    acceptPending: acceptMutation.isPending,
    statusPending: statusMutation.isPending,
    ratePending: rateMutation.isPending,
    acceptRequest: (id) => withToast(() => acceptMutation.mutateAsync({ id }), "Request accepted", "Could not accept request"),
    updateStatus: (id, status) => withToast(() => statusMutation.mutateAsync({ id, body: { status } }), status === "completed" ? "Request completed" : "Request updated", "Could not update request"),
    ratePatient: (id, body) => withToast(() => rateMutation.mutateAsync({ id, body }), "Patient rating saved", "Could not save rating"),
  };
}
