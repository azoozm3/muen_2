import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { saveProviderPatientRating } from "./providerPatientRating";

export function useProviderPatientRating({
  queryKey,
  successTitle = "Patient rating saved",
  errorTitle = "Could not save patient rating",
}) {
  const { toast } = useToast();

  return useCallback(async (payload) => {
    try {
      const result = await saveProviderPatientRating({ queryKey, ...payload });
      toast({ title: successTitle });
      return result;
    } catch (error) {
      toast({ title: errorTitle, description: error.message, variant: "destructive" });
      throw error;
    }
  }, [errorTitle, queryKey, successTitle, toast]);
}
