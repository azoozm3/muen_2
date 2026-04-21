import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCancelNurseRequest, useCreateNurseRequest, useNurseRequests } from "@/hooks/use-nurse-requests";
import { CurrentRequestsSection, HistorySection } from "@/features/nurse-requests/patient/NurseRequestSections";
import { NurseRequestFormPanel } from "@/features/nurse-requests/patient/NurseRequestFormPanel";
import { NurseRequestsHeader } from "@/features/nurse-requests/patient/NurseRequestsHeader";
import { isCurrentNurseRequest, isHistoryNurseRequest } from "@/features/nurse-requests/shared/requestStatus";

export default function PatientNurseRequests() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const { data: nurseRequests = [], isLoading } = useNurseRequests();
  const createMutation = useCreateNurseRequest();
  const cancelMutation = useCancelNurseRequest();

  const currentRequests = useMemo(() => nurseRequests.filter(isCurrentNurseRequest), [nurseRequests]);
  const historyRequests = useMemo(() => nurseRequests.filter(isHistoryNurseRequest), [nurseRequests]);
  const canCreateNewRequest = currentRequests.length === 0;
  const shouldShowForm = showForm || canCreateNewRequest;

  const handleCreate = async (payload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast({ title: "Request sent", description: "Your nurse request was sent." });
      setShowForm(false);
    } catch (error) {
      toast({ title: "Could not send", description: error.message || "Please try again.", variant: "destructive" });
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await cancelMutation.mutateAsync({ id: requestId });
      toast({ title: "Request cancelled", description: "The nurse request was cancelled successfully." });
    } catch (error) {
      toast({ title: "Cancel failed", description: error.message || "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <NurseRequestsHeader canCreateNewRequest={canCreateNewRequest} shouldShowForm={shouldShowForm} onOpenForm={() => setShowForm(true)} />
        {shouldShowForm ? <NurseRequestFormPanel canCreateNewRequest={canCreateNewRequest} isSubmitting={createMutation.isPending} onClose={() => setShowForm(false)} onSubmit={handleCreate} /> : null}
        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-2xl border bg-card shadow-sm"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <CurrentRequestsSection currentRequests={currentRequests} cancelMutation={cancelMutation} onCancel={handleCancel} />
            <HistorySection historyRequests={historyRequests} />
          </>
        )}
      </div>
    </div>
  );
}
