import { useMemo, useState } from "react";
import { useRequests, useUpdateStatus } from "@/hooks/use-emergency-requests";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { DOCTOR_TAB_LABELS } from "@/components/doctor/doctorConstants";
import { getDoctorCaseGroups } from "@/components/doctor/doctorUtils";
import { useProviderPatientRating } from "@/features/provider-dashboard/useProviderPatientRating";

export function useDoctorDashboard() {
  const { user } = useAuth();
  const { data: requests = [], isLoading } = useRequests();
  const updateStatus = useUpdateStatus();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("available");
  const savePatientRating = useProviderPatientRating({ queryKey: ["/api/requests"], successTitle: "Patient rating saved", errorTitle: "Rating failed" });

  const { availableCases, myCases, resolvedCases } = useMemo(() => {
    const groups = getDoctorCaseGroups(requests, user?.id);
    return { availableCases: groups.availableCases, myCases: groups.myCases, resolvedCases: groups.resolvedCases };
  }, [requests, user?.id]);

  const tabs = [
    { value: "available", label: DOCTOR_TAB_LABELS.available, count: availableCases.length },
    { value: "my-cases", label: DOCTOR_TAB_LABELS["my-cases"], count: myCases.length },
    { value: "resolved", label: DOCTOR_TAB_LABELS.resolved, count: resolvedCases.length },
  ];

  const handleAccept = (id) => {
    updateStatus.mutate({ requestId: id, status: "accepted" }, {
      onSuccess: () => {
        toast({ title: "Case Accepted", description: "You are now the primary responder." });
        setActiveTab("my-cases");
      },
      onError: (error) => toast({ title: "Failed", description: error.message, variant: "destructive" }),
    });
  };

  const handleStatusUpdate = (id, status) => {
    updateStatus.mutate({ requestId: id, status }, { onError: (error) => toast({ title: "Failed", description: error.message, variant: "destructive" }) });
  };

  const handleSavePatientRating = (request, payload) => savePatientRating({
    patientId: request?.patientId || request?.patient?._id || null,
    interactionType: "emergency",
    interactionId: request.id || request._id,
    rating: payload.rating,
    feedback: payload.feedback,
  });

  return { user, isLoading, activeTab, setActiveTab, tabs, availableCases, myCases, resolvedCases, updateStatus, handleAccept, handleStatusUpdate, handleSavePatientRating };
}
