import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { ProfileLink } from "@/components/common/ProfileLink";
import { PatientInteractionRating } from "@/components/common/PatientInteractionRating";
import { getCaseDisplayId } from "../doctorUtils";

export function ResolvedCasesCard({ cases, onRatePatient }) {
  return (
    <Card className="rounded-xl">
      <div className="p-6"><h3 className="font-semibold">Resolved Cases</h3></div>
      <div className="divide-y">
        {cases.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No resolved history yet.</div>
        ) : (
          cases.map((request) => (
            <div key={request.id || request._id} className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium"><ProfileLink id={request.patientId} role="patient" className="font-medium">{request.name}</ProfileLink></div>
                  <div className="text-sm text-muted-foreground">{getCaseDisplayId(request)} · {request.location}</div>
                </div>
                <StatusBadge status={request.status} />
              </div>
              <PatientInteractionRating existingRating={request.providerPatientRating} existingFeedback={request.providerPatientFeedback} onSave={(payload) => onRatePatient?.(request, payload)} />
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
