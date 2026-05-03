import { useMemo, useState } from "react";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatValue(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value;
}

function ReportItem({ label, value, className = "" }) {
  const content = formatValue(value);
  if (!content) return null;

  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm ${className}`.trim()}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm font-medium leading-6 text-slate-900 sm:text-[15px]">{content}</p>
    </div>
  );
}

export function ReportDialogButton({ report = {} }) {
  const [open, setOpen] = useState(false);

  const sections = useMemo(
    () => [
      { label: "Condition", value: report.generalCondition },
      {
        label: "Care",
        value: Array.isArray(report.servicesProvided)
          ? report.servicesProvided.join(", ")
          : report.servicesProvided,
      },
      { label: "Blood Pressure", value: report.vitalSigns?.bloodPressure },
      { label: "Heart Rate", value: report.vitalSigns?.heartRate },
      { label: "Temperature", value: report.vitalSigns?.temperature },
      { label: "Oxygen", value: report.vitalSigns?.oxygenSaturation },
      { label: "Notes", value: report.notes, className: "md:col-span-2" },
      { label: "Follow Up", value: report.followUpInstructions, className: "md:col-span-2" },
      { label: "Recommendation", value: report.recommendation },
    ],
    [report],
  );

  return (
    <>
      <Button type="button" variant="outline" className="gap-2" onClick={() => setOpen(true)}>
        <FileText className="h-4 w-4" />
        Report
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">Visit Report</h3>
                  <p className="mt-1 text-sm text-slate-600">Clear visit summary.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 shrink-0 rounded-xl border-slate-300 px-3 text-slate-700"
                  onClick={() => setOpen(false)}
                >
                  <X className="mr-1 h-4 w-4 sm:hidden" />
                  <span className="hidden sm:inline">Close</span>
                </Button>
              </div>
            </div>

            <div className="max-h-[78vh] overflow-y-auto bg-slate-100/90 px-4 py-4 sm:px-6 sm:py-5">
              <div className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {sections.some((section) => formatValue(section.value)) ? (
                    sections.map((section) => (
                      <ReportItem
                        key={section.label}
                        label={section.label}
                        value={section.value}
                        className={section.className}
                      />
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                      No report details saved yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
