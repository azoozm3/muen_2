import { Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEASUREMENT_OPTIONS } from "./reportFormConfig";

export function QuickToggleGroup({ options, values, onToggle, single = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = single ? values === option.value : values.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onToggle(option.value)}
            className={`rounded-full border px-3 py-2 text-sm transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function MeasurementRow({ entry, index, onChange, onRemove, canRemove }) {
  const selectedOption = MEASUREMENT_OPTIONS.find((option) => option.value === entry.type) || MEASUREMENT_OPTIONS[0];

  return (
    <div className="grid gap-3 rounded-2xl border bg-background p-3 md:grid-cols-[1.2fr_1fr_auto]">
      <div className="space-y-2">
        <Label>Test Type</Label>
        <Select value={entry.type} onValueChange={(value) => onChange(index, { ...entry, type: value })}>
          <SelectTrigger><SelectValue placeholder="Choose test type" /></SelectTrigger>
          <SelectContent position="popper" className="z-[100] max-h-72">
            {MEASUREMENT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Measurement</Label>
        <Input value={entry.value} placeholder={selectedOption.placeholder} onChange={(e) => onChange(index, { ...entry, value: e.target.value })} />
      </div>

      <div className="flex items-end">
        {canRemove ? <Button type="button" variant="ghost" onClick={() => onRemove(index)} className="w-full md:w-auto"><Minus className="mr-2 h-4 w-4" /> Remove</Button> : null}
      </div>

      <div className="md:col-span-3">
        <Input value={entry.note || ""} placeholder="Optional note" onChange={(e) => onChange(index, { ...entry, note: e.target.value })} />
      </div>
    </div>
  );
}

export function AdviceItemFields({ item, onChange, onRemove, canRemove }) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h5 className="font-medium">Advice Item</h5>
        {canRemove ? <Button type="button" variant="ghost" size="sm" onClick={onRemove}><Minus className="mr-1 h-4 w-4" /> Remove</Button> : null}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Input placeholder="Medicine or care item" value={item.name} onChange={(e) => onChange("name", e.target.value)} />
        <Input placeholder="Dosage" value={item.dosage} onChange={(e) => onChange("dosage", e.target.value)} />
        <Input placeholder="Frequency" value={item.frequency} onChange={(e) => onChange("frequency", e.target.value)} />
        <Input placeholder="Duration" value={item.duration} onChange={(e) => onChange("duration", e.target.value)} />
      </div>
      <Textarea className="mt-3 min-h-20" placeholder="Notes" value={item.notes} onChange={(e) => onChange("notes", e.target.value)} />
    </div>
  );
}
