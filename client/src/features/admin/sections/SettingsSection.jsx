import { Button } from "@/components/ui/button";
import { useEditableSyncState } from "@/hooks/use-editable-sync-state";
import { AdminSectionCard } from "@/features/admin/components/AdminSectionCard";

function buildInitialForm(data) {
  return {
    appointmentPrice: data?.servicePricing?.appointment?.price ?? 0,
    appointmentFee: data?.servicePricing?.appointment?.platformFee ?? 0,
    nursePrice: data?.servicePricing?.nurseRequest?.price ?? 0,
    nurseFee: data?.servicePricing?.nurseRequest?.platformFee ?? 0,
  };
}

function PriceInput({ label, value, onChange }) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-2xl border bg-white px-3 outline-none transition focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

export function SettingsSection({ data, onSave, isSaving }) {
  const {
    value: form,
    setValue: setForm,
  } = useEditableSyncState(data, buildInitialForm);

  const updateValue = (key, value) => {
    setForm((current) => ({ ...current, [key]: Number(value) || 0 }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      servicePricing: {
        appointment: { price: form.appointmentPrice, platformFee: form.appointmentFee },
        nurseRequest: { price: form.nursePrice, platformFee: form.nurseFee },
      },
    });
  };

  return (
    <AdminSectionCard title="Settings" subtitle="Service pricing.">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <PriceInput
          label="Appointment Price"
          value={form.appointmentPrice}
          onChange={(event) => updateValue("appointmentPrice", event.target.value)}
        />
        <PriceInput
          label="Appointment Fee"
          value={form.appointmentFee}
          onChange={(event) => updateValue("appointmentFee", event.target.value)}
        />
        <PriceInput
          label="Nurse Request Price"
          value={form.nursePrice}
          onChange={(event) => updateValue("nursePrice", event.target.value)}
        />
        <PriceInput
          label="Nurse Request Fee"
          value={form.nurseFee}
          onChange={(event) => updateValue("nurseFee", event.target.value)}
        />

        <div className="flex justify-stretch md:col-span-2 md:justify-end">
          <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </AdminSectionCard>
  );
}
