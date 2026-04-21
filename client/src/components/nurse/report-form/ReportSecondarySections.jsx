import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RECOMMENDATION_OPTIONS, createAdviceItem } from "./reportFormConfig";
import { normalizeReport } from "./reportFormHelpers";
import { AdviceItemFields, QuickToggleGroup } from "./ReportFormFields";

export function ReportSecondarySections({ item, normalizedReport, updateReport }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Recommendation</Label>
          <QuickToggleGroup
            options={RECOMMENDATION_OPTIONS}
            values={normalizedReport.recommendation}
            single
            onToggle={(value) => updateReport((current) => ({ ...normalizeReport(current), recommendation: current.recommendation === value ? "" : value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Recommendation Notes</Label>
          <Textarea value={normalizedReport.recommendationNotes} placeholder="Optional note" onChange={(e) => updateReport((current) => ({ ...normalizeReport(current), recommendationNotes: e.target.value }))} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Follow-up Plan</Label>
          <Textarea value={normalizedReport.followUpPlan} placeholder="Optional follow-up details" onChange={(e) => updateReport((current) => ({ ...normalizeReport(current), followUpPlan: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Extra Note</Label>
          <Textarea value={normalizedReport.generalCondition} placeholder="Only if needed" onChange={(e) => updateReport((current) => ({ ...normalizeReport(current), generalCondition: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="font-semibold">Advice / Prescription</h5>
          <Button type="button" variant="outline" onClick={() => updateReport((current) => ({ ...normalizeReport(current), adviceItems: [...normalizeReport(current).adviceItems, createAdviceItem()] }))}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
        {normalizedReport.adviceItems.length ? normalizedReport.adviceItems.map((adviceItem, index) => (
          <AdviceItemFields
            key={`${item.id || item._id || "item"}-advice-${index}`}
            item={adviceItem}
            canRemove={normalizedReport.adviceItems.length > 1}
            onChange={(field, value) => updateReport((current) => ({ ...normalizeReport(current), adviceItems: normalizeReport(current).adviceItems.map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: value } : entry) }))}
            onRemove={() => updateReport((current) => ({ ...normalizeReport(current), adviceItems: normalizeReport(current).adviceItems.filter((_, entryIndex) => entryIndex !== index) }))}
          />
        )) : <div className="rounded-2xl border border-dashed bg-background/80 p-4 text-sm text-muted-foreground">No advice items added.</div>}
      </div>
    </>
  );
}
