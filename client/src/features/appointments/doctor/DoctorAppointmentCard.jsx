import { Card } from "@/components/ui/card";
import { PatientInteractionRating } from "@/components/common/PatientInteractionRating";
import { DoctorAppointmentClinicalSection } from "./DoctorAppointmentClinicalSection";
import { DoctorAppointmentActions, DoctorAppointmentSummary } from "./DoctorAppointmentSummary";

export default function DoctorAppointmentCard({ appointment, isHistory = false, handleStatusChange, updatePending, detailsState, saveDetails, saveDetailsPending, ratePatientMutation }) {
  return (
    <Card className="rounded-2xl p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <DoctorAppointmentSummary appointment={appointment} />
        <DoctorAppointmentActions appointment={appointment} isHistory={isHistory} handleStatusChange={handleStatusChange} updatePending={updatePending} />
      </div>

      <DoctorAppointmentClinicalSection appointment={appointment} detailsState={detailsState} saveDetails={saveDetails} saveDetailsPending={saveDetailsPending} />

      {isHistory && appointment.status === "completed" ? (
        <div className="mt-4">
          <PatientInteractionRating existingRating={appointment.providerPatientRating} existingFeedback={appointment.providerPatientFeedback} onSave={(payload) => ratePatientMutation.mutate({ appointment, payload })} isPending={ratePatientMutation.isPending} />
        </div>
      ) : null}
    </Card>
  );
}
