import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEditableSyncState } from "@/hooks/use-editable-sync-state";
import { useToast } from "@/hooks/use-toast";
import { liveQueryOptions } from "@/lib/liveQuery";
import { apiRequest, fetchJson } from "@/lib/queryClient";
import HealthRecordEditor from "@/features/health-record/HealthRecordEditor";
import { normalizeMedicalHistory } from "@/features/health-record/healthRecordUtils";

export default function PatientHealthRecord() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profiles/me"],
    queryFn: () => fetchJson("/api/profiles/me", "Failed to load profile"),
    ...liveQueryOptions(),
  });

  const {
    value: rows,
    setValue: setRows,
    resetValue: resetRows,
  } = useEditableSyncState(profile?.medicalHistory, normalizeMedicalHistory);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        medicalHistory: rows.filter((row) => {
          const title = row?.title?.trim?.() || "";
          const details = row?.details?.trim?.() || "";
          const recordDate = row?.recordDate?.trim?.() || "";
          return title || details || recordDate;
        }),
      };
      const res = await apiRequest("PATCH", "/api/profiles", payload);
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["/api/profiles/me"], updated);
      resetRows(updated?.medicalHistory);
      toast({ title: "Health record updated", description: "Rows saved." });
    },
    onError: (err) => {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="app-page-shell">
      <div className="app-page-container max-w-5xl">
        <div className="mb-6 rounded-3xl border bg-white p-4 shadow-sm sm:p-6">
          <h1 className="text-2xl font-bold sm:text-3xl">My Health Record</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Keep your medical details ready for appointments.</p>
        </div>

        {isLoading ? (
          <Card className="p-6">
            <Loader2 className="h-5 w-5 animate-spin" />
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="overflow-hidden rounded-3xl border p-3 sm:p-6">
              <HealthRecordEditor value={rows} onChange={setRows} />
            </Card>

            <div className="flex justify-stretch sm:justify-end">
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="w-full sm:w-auto">
                {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Health Record
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
