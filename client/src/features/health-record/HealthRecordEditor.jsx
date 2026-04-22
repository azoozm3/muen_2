import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createEmptyMedicalHistoryRow } from "./healthRecordUtils";

export default function HealthRecordEditor({ value = [], onChange }) {
  const rows = Array.isArray(value) ? value : [];

  const updateRow = (index, key, nextValue) => {
    const nextRows = rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: nextValue } : row);
    onChange(nextRows);
  };

  const addRow = () => onChange([...rows, createEmptyMedicalHistoryRow()]);
  const removeRow = (index) => onChange(rows.filter((_, rowIndex) => rowIndex !== index));

  return (
    <div className="space-y-3">
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">No health record rows yet. Add your first row below.</p> : null}

      {rows.map((row, index) => (
        <Card key={index} className="space-y-3 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input className="w-full rounded-md border px-3 py-2" value={row.title || ""} onChange={(e) => updateRow(index, "title", e.target.value)} placeholder="Allergy, surgery, chronic condition..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Date</label>
              <input type="date" className="w-full rounded-md border px-3 py-2" value={row.recordDate || ""} onChange={(e) => updateRow(index, "recordDate", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Details</label>
            <input className="w-full rounded-md border px-3 py-2" value={row.details || ""} onChange={(e) => updateRow(index, "details", e.target.value)} placeholder="Write the health detail here" />
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => removeRow(index)}>
              <Trash2 className="mr-2 h-4 w-4" /> Remove row
            </Button>
          </div>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addRow}>
        <Plus className="mr-2 h-4 w-4" /> Add row
      </Button>
    </div>
  );
}
