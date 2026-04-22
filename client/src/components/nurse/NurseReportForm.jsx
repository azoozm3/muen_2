import { CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeReport, prepareReportPayload } from "./report-form/reportFormHelpers";
import { ReportPrimarySections } from "./report-form/ReportPrimarySections";
import { ReportSecondarySections } from "./report-form/ReportSecondarySections";

export { EMPTY_REPORT } from "./report-form/reportFormConfig";
export { normalizeReport } from "./report-form/reportFormHelpers";

function ReportActions({ item, onCompleteVisit, onPersistReport, statusMutation, reportMutation, updateStatus }) {
  return (
    <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
      {item.status === "accepted" ? (
        <Button variant="outline" onClick={() => updateStatus("in_progress")} disabled={statusMutation.isPending}>
          Mark In Progress
        </Button>
      ) : null}
      <Button variant="outline" onClick={onPersistReport} disabled={reportMutation.isPending}>
        Save Report
      </Button>
      <Button onClick={onCompleteVisit} disabled={reportMutation.isPending || statusMutation.isPending}>
        <CheckCircle2 className="mr-2 h-4 w-4" /> Complete Visit
      </Button>
    </div>
  );
}

export function NurseReportForm({ item, report, updateReport, saveReport, updateStatus, reportMutation, statusMutation }) {
  const normalizedReport = normalizeReport(report);
  const persistReport = () => saveReport(prepareReportPayload(normalizedReport));
  const completeVisit = async () => {
    await saveReport(prepareReportPayload(normalizedReport));
    updateStatus("completed");
  };

  return (
    <div className="mt-5 space-y-5 rounded-2xl border bg-secondary/30 p-4">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <h4 className="font-semibold">Quick Visit Report</h4>
      </div>

      <ReportPrimarySections item={item} normalizedReport={normalizedReport} updateReport={updateReport} />
      <ReportSecondarySections item={item} normalizedReport={normalizedReport} updateReport={updateReport} />
      <ReportActions item={item} onCompleteVisit={completeVisit} onPersistReport={persistReport} statusMutation={statusMutation} reportMutation={reportMutation} updateStatus={updateStatus} />
    </div>
  );
}
