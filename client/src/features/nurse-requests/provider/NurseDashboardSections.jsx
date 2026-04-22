import { CheckCircle2, ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { NurseRequestCard } from "@/components/nurse/NurseRequestCard";
import { NurseReportForm } from "@/components/nurse/NurseReportForm";
import { getEntityId } from "@/components/nurse/nurseUtils";
import { PatientInteractionRating } from "@/components/common/PatientInteractionRating";
import { ProviderHeaderAction } from "@/features/provider-dashboard/ProviderDashboardLayout";

function OpenPatientLink({ patientId }) {
  if (!patientId) return null;

  return (
    <a
      href={`/patient/${patientId}`}
      className="mt-4 inline-flex rounded-2xl border px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
    >
      Open patient page
    </a>
  );
}

function SavedVisitSummary({ report = {} }) {
  if (!report.generalCondition && !report.recommendation) return null;

  return (
    <div className="mt-4 rounded-2xl border bg-secondary/40 p-4 text-sm">
      <div className="font-semibold">Saved Visit Summary</div>
      {report.generalCondition ? <div className="mt-2"><span className="font-medium">Condition:</span> {report.generalCondition}</div> : null}
      {report.recommendation ? <div className="mt-2"><span className="font-medium">Recommendation:</span> {report.recommendation.replaceAll("_", " ")}</div> : null}
    </div>
  );
}

export function NewNurseRequestsTab({ items, onAccept, isPending }) {
  if (!items.length) return <EmptyState icon={ClipboardList} title="No new requests" subtitle="New home-care requests will appear here." />;

  return items.map((item) => (
    <NurseRequestCard key={getEntityId(item) || item.publicRequestId} item={item}>
      <OpenPatientLink patientId={item.patientId} />
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <ProviderHeaderAction variant="default" icon={CheckCircle2} onClick={() => onAccept(item)} disabled={isPending}>
          Accept Visit
        </ProviderHeaderAction>
      </div>
    </NurseRequestCard>
  ));
}

export function ActiveNurseVisitsTab({ items, getReport, updateReport, saveReport, updateStatus, reportMutation, statusMutation }) {
  if (!items.length) return <EmptyState icon={ClipboardList} title="No active visits" subtitle="Accepted requests will move here." />;

  return items.map((item) => {
    const id = getEntityId(item);
    const report = getReport(id, item.visitReport);

    return (
      <NurseRequestCard key={id || item.publicRequestId} item={item}>
        <OpenPatientLink patientId={item.patientId} />
        <NurseReportForm
          item={item}
          report={report}
          updateReport={(updater) => updateReport(id, updater, item.visitReport)}
          saveReport={(payload) => saveReport(item, payload)}
          updateStatus={(status) => updateStatus(item, status)}
          reportMutation={reportMutation}
          statusMutation={statusMutation}
        />
      </NurseRequestCard>
    );
  });
}

export function NurseVisitHistoryTab({ items, onRatePatient }) {
  if (!items.length) return <EmptyState icon={ClipboardList} title="No visit history" subtitle="Completed and cancelled requests will appear here." />;

  return items.map((item) => (
    <NurseRequestCard key={getEntityId(item) || item.publicRequestId} item={item}>
      <OpenPatientLink patientId={item.patientId} />
      <SavedVisitSummary report={item.visitReport} />
      {item.patientId && item.status === "completed" ? (
        <div className="mt-4">
          <PatientInteractionRating
            existingRating={item.providerPatientRating}
            existingFeedback={item.providerPatientFeedback}
            onSave={(payload) => onRatePatient(item, payload)}
          />
        </div>
      ) : null}
    </NurseRequestCard>
  ));
}
