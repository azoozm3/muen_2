import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function createEmptyMedicineRow() {
  return {
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: "",
  };
}

export function normalizePrescriptionRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({
    medicineName: row?.medicineName || "",
    dosage: row?.dosage || "",
    frequency: row?.frequency || "",
    duration: row?.duration || "",
    notes: row?.notes || "",
  }));
}

export default function PrescriptionEditor({ value = [], onChange }) {
  const rows = Array.isArray(value) ? value : [];

  const updateRow = (index, key, nextValue) => {
    onChange(rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: nextValue } : row));
  };

  const addRow = () => onChange([...rows, createEmptyMedicineRow()]);
  const removeRow = (index) => onChange(rows.filter((_, rowIndex) => rowIndex !== index));

  return (
    <div className="space-y-3">
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">No medicines added yet.</p> : null}
      {rows.map((row, index) => (
        <Card key={index} className="space-y-3 p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Medicine</label>
              <input className="w-full rounded-md border px-3 py-2" value={row.medicineName || ""} onChange={(e) => updateRow(index, "medicineName", e.target.value)} placeholder="Paracetamol" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Dosage</label>
              <input className="w-full rounded-md border px-3 py-2" value={row.dosage || ""} onChange={(e) => updateRow(index, "dosage", e.target.value)} placeholder="500 mg" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Frequency</label>
              <input className="w-full rounded-md border px-3 py-2" value={row.frequency || ""} onChange={(e) => updateRow(index, "frequency", e.target.value)} placeholder="2 times daily" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Duration</label>
              <input className="w-full rounded-md border px-3 py-2" value={row.duration || ""} onChange={(e) => updateRow(index, "duration", e.target.value)} placeholder="5 days" />
            </div>
            <div className="md:col-span-2 xl:col-span-2">
              <label className="mb-1 block text-sm font-medium">Notes</label>
              <input className="w-full rounded-md border px-3 py-2" value={row.notes || ""} onChange={(e) => updateRow(index, "notes", e.target.value)} placeholder="After food, before sleep, etc." />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => removeRow(index)}>
              <Trash2 className="mr-2 h-4 w-4" /> Remove medicine
            </Button>
          </div>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addRow}>
        <Plus className="mr-2 h-4 w-4" /> Add medicine
      </Button>
    </div>
  );
}
