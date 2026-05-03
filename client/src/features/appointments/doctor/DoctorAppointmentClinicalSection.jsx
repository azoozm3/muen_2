import { Button } from "@/components/ui/button";
import PrescriptionEditor, { normalizePrescriptionRows } from "@/features/appointments/PrescriptionEditor";
import PrescriptionList from "@/features/appointments/PrescriptionList";

export function DoctorAppointmentClinicalSection({ appointment, detailsState, saveDetails, saveDetailsPending }) {
  const appointmentId = appointment.id || appointment._id;
  const canWrite = ["confirmed", "completed"].includes(appointment.status);
  const { detailsForm, setDetailsForm, summaryText, setSummaryText, prescriptionRows, setPrescriptionRows } = detailsState;
  if (!canWrite) return null;

  const currentSummary = summaryText[appointmentId] ?? appointment.consultationSummary ?? appointment.consultationNotes ?? "";
  const currentPrescription = prescriptionRows[appointmentId] ?? normalizePrescriptionRows(appointment.prescription);

  return (
    <div className="mt-4 space-y-4 rounded-xl border bg-muted/20 p-4">
      {appointment.consultationSummary || appointment.consultationNotes ? (
        <div>
          <p className="mb-1 text-sm font-medium">Consultation summary</p>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{appointment.consultationSummary || appointment.consultationNotes}</p>
        </div>
      ) : null}

      {Array.isArray(appointment.prescription) && appointment.prescription.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium">Saved prescription</p>
          <PrescriptionList items={appointment.prescription} />
        </div>
      ) : null}

      {!detailsForm[appointmentId] ? (
        <Button variant="outline" onClick={() => setDetailsForm((prev) => ({ ...prev, [appointmentId]: true }))}>
          {appointment.consultationSummary || appointment.consultationNotes || appointment.prescription?.length ? "Edit clinical details" : "Add clinical details"}
        </Button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Consultation summary</label>
            <textarea rows={4} className="w-full rounded-md border px-3 py-2" value={currentSummary} onChange={(e) => setSummaryText((prev) => ({ ...prev, [appointmentId]: e.target.value }))} placeholder="Reason for visit, doctor assessment, and general guidance" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Prescription</label>
            <PrescriptionEditor value={currentPrescription} onChange={(rows) => setPrescriptionRows((prev) => ({ ...prev, [appointmentId]: rows }))} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => saveDetails(appointmentId)} disabled={saveDetailsPending}>Save details</Button>
            <Button variant="outline" onClick={() => setDetailsForm((prev) => ({ ...prev, [appointmentId]: false }))}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
