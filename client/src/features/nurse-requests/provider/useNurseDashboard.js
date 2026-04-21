import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { EMPTY_REPORT, normalizeReport } from "@/components/nurse/NurseReportForm";
import { getEntityId, getUserId } from "@/components/nurse/nurseUtils";
import { useProviderPatientRating } from "@/features/provider-dashboard/useProviderPatientRating";
import { useNurseRequests, useRespondToNurseRequest, useSaveNurseVisitReport, useUpdateNurseRequestStatus } from "@/hooks/use-nurse-requests";

export function useNurseDashboard(user) {
  const { toast } = useToast();
  const { data: requests = [], isLoading } = useNurseRequests();
  const respondMutation = useRespondToNurseRequest();
  const statusMutation = useUpdateNurseRequestStatus();
  const reportMutation = useSaveNurseVisitReport();
  const [activeTab, setActiveTab] = useState("new");
  const [reports, setReports] = useState({});
  const currentUserId = getUserId(user);
  const savePatientRating = useProviderPatientRating({ queryKey: ["/api/nurse-requests"], successTitle: "Patient rated successfully", errorTitle: "Rating failed" });

  const groups = useMemo(() => ({
    pending: requests.filter((item) => item.status === "pending"),
    active: requests.filter((item) => String(item.nurseId || "") === String(currentUserId) && ["accepted", "in_progress"].includes(item.status)),
    completed: requests.filter((item) => String(item.nurseId || "") === String(currentUserId) && ["completed", "cancelled"].includes(item.status)),
  }), [requests, currentUserId]);

  const tabs = [
    { value: "new", label: "New Requests", count: groups.pending.length },
    { value: "active", label: "Accepted Visits", count: groups.active.length },
    { value: "history", label: "Visit History", count: groups.completed.length },
  ];

  const getReport = (id, visitReport) => reports[id] || normalizeReport({ ...EMPTY_REPORT, ...visitReport });
  const updateReport = (id, updater, visitReport) => setReports((prev) => ({ ...prev, [id]: typeof updater === "function" ? updater(getReport(id, visitReport)) : updater }));

  const respond = (item, action) => {
    const id = getEntityId(item);
    if (!id) return toast({ title: "Action failed", description: "Request id is missing. Refresh the page and try again.", variant: "destructive" });
    respondMutation.mutate(
      { id, action },
      { onSuccess: () => { toast({ title: action === "accepted" ? "Request accepted" : "Request rejected" }); if (action === "accepted") setActiveTab("active"); }, onError: (error) => toast({ title: "Action failed", description: error.message, variant: "destructive" }) },
    );
  };

  const saveReport = (item, payloadOverride) => {
    const id = getEntityId(item);
    if (!id) return;
    const payload = payloadOverride || getReport(id, item.visitReport);
    reportMutation.mutate({ id, ...payload }, { onSuccess: () => toast({ title: "Visit report saved" }), onError: (error) => toast({ title: "Save failed", description: error.message, variant: "destructive" }) });
  };

  const updateStatus = (item, status) => {
    const id = getEntityId(item);
    if (!id) return;
    statusMutation.mutate({ id, status }, { onSuccess: () => toast({ title: `Request ${status.replace("_", " ")}` }), onError: (error) => toast({ title: "Update failed", description: error.message, variant: "destructive" }) });
  };

  const handleSavePatientRating = (item, payload) => savePatientRating({
    patientId: item.patientId,
    interactionType: "nurse_request",
    interactionId: getEntityId(item),
    rating: payload.rating,
    feedback: payload.feedback,
  });

  return { isLoading, activeTab, setActiveTab, tabs, groups, getReport, updateReport, respond, saveReport, updateStatus, handleSavePatientRating, respondMutation, statusMutation, reportMutation };
}
