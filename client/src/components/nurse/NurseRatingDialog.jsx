import { cloneElement, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRateNurseRequest } from "@/hooks/use-nurse-requests";
import { RatingDialog } from "@/components/common/RatingDialog";

export function NurseRatingDialog({ nurseRequest, children }) {
  const { toast } = useToast();
  const mutation = useRateNurseRequest();

  const trigger = useMemo(() => {
    if (!children) return null;
    return cloneElement(children, { type: "button" });
  }, [children]);

  return (
    <RatingDialog
      title="Rate Nurse"
      description={nurseRequest.nurseName ? `Leave a quick rating for ${nurseRequest.nurseName}.` : "Leave a quick rating for the nurse."}
      trigger={trigger}
      loading={mutation.isPending}
      onSubmit={async ({ rating, feedback }) => {
        try {
          await mutation.mutateAsync({ id: nurseRequest.id, rating, comment: feedback });
          toast({ title: "Nurse rated successfully" });
        } catch (error) {
          toast({ title: "Rating failed", description: error.message, variant: "destructive" });
        }
      }}
    />
  );
}
