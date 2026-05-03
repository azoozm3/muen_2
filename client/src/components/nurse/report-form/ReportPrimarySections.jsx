import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONDITION_OPTIONS, CARE_OPTIONS, createMeasurement } from "./reportFormConfig";
import { normalizeReport } from "./reportFormHelpers";
import { MeasurementRow, QuickToggleGroup } from "./ReportFormFields";

export function ReportPrimarySections({ item, normalizedReport, updateReport }) {
  return (
    <>
      <div className="space-y-2">
        <Label>General Condition</Label>
        <QuickToggleGroup
          options={CONDITION_OPTIONS}
          values={normalizedReport.quickCondition}
          single
          onToggle={(value) => updateReport((current) => ({ ...normalizeReport(current), quickCondition: current.quickCondition === value ? "" : value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Care Provided</Label>
        <Select
          value={normalizedReport.careChecklist[0] || "none"}
          onValueChange={(value) => updateReport((current) => ({ ...normalizeReport(current), careChecklist: value === "none" ? [] : [value] }))}
        >
          <SelectTrigger className="rounded-2xl bg-background"><SelectValue placeholder="Choose care provided" /></SelectTrigger>
          <SelectContent className="z-[100] rounded-2xl border bg-background shadow-xl">
            <SelectItem value="none">No care selected</SelectItem>
            {CARE_OPTIONS.map((label) => <SelectItem key={label} value={label}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="font-semibold">Measurements</h5>
          <Button type="button" variant="outline" onClick={() => updateReport((current) => ({ ...normalizeReport(current), measurements: [...normalizeReport(current).measurements, createMeasurement()] }))}>
            <Plus className="mr-2 h-4 w-4" /> Add Test
          </Button>
        </div>

        {normalizedReport.measurements.length ? (
          <div className="space-y-3">
            {normalizedReport.measurements.map((entry, index) => (
              <MeasurementRow
                key={`${item.id || item._id || "item"}-measurement-${index}`}
                entry={entry}
                index={index}
                canRemove={normalizedReport.measurements.length > 1}
                onChange={(entryIndex, nextEntry) => updateReport((current) => ({ ...normalizeReport(current), measurements: normalizeReport(current).measurements.map((measurement, measurementIndex) => measurementIndex === entryIndex ? nextEntry : measurement) }))}
                onRemove={(entryIndex) => updateReport((current) => ({ ...normalizeReport(current), measurements: normalizeReport(current).measurements.filter((_, measurementIndex) => measurementIndex !== entryIndex) }))}
              />
            ))}
          </div>
        ) : <div className="rounded-2xl border border-dashed bg-background/80 p-4 text-sm text-muted-foreground">No tests added yet.</div>}
      </div>
    </>
  );
}
