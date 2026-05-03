import { CONDITION_OPTIONS, EMPTY_REPORT } from "./reportFormConfig";

function buildMeasurementsFromReport(report) {
  const items = [];
  if (report?.bloodPressure) items.push({ type: "bloodPressure", value: report.bloodPressure, note: "" });
  if (report?.bloodSugar) items.push({ type: "bloodSugar", value: report.bloodSugar, note: "" });
  if (report?.temperature) items.push({ type: "temperature", value: report.temperature, note: "" });
  if (report?.pulse) items.push({ type: "pulse", value: report.pulse, note: "" });
  if (report?.pregnancyTest) items.push({ type: "pregnancyTest", value: report.pregnancyTest, note: "" });
  return items;
}

export function normalizeReport(report = {}) {
  return {
    ...EMPTY_REPORT,
    ...report,
    careChecklist: Array.isArray(report.careChecklist) ? report.careChecklist : [],
    measurements: Array.isArray(report.measurements) ? report.measurements : buildMeasurementsFromReport(report),
    adviceItems: Array.isArray(report.adviceItems) ? report.adviceItems : [],
  };
}

export function prepareReportPayload(report) {
  const measurements = Array.isArray(report.measurements) ? report.measurements.filter((entry) => entry?.type && entry?.value) : [];
  const mapped = { bloodPressure: "", bloodSugar: "", temperature: "", pulse: "", pregnancyTest: "" };

  measurements.forEach((entry) => {
    if (mapped[entry.type] !== undefined && !mapped[entry.type]) mapped[entry.type] = entry.value;
  });

  const quickConditionLabel = CONDITION_OPTIONS.find((option) => option.value === report.quickCondition)?.label || "";

  return {
    ...report,
    generalCondition: report.generalCondition || quickConditionLabel,
    careProvided: report.careProvided || (report.careChecklist || []).join(", "),
    bloodPressure: mapped.bloodPressure || report.bloodPressure || "",
    bloodSugar: mapped.bloodSugar || report.bloodSugar || "",
    temperature: mapped.temperature || report.temperature || "",
    pulse: mapped.pulse || report.pulse || "",
    pregnancyTest: mapped.pregnancyTest || report.pregnancyTest || "",
    measurements,
    adviceItems: Array.isArray(report.adviceItems) ? report.adviceItems.filter((entry) => entry?.name || entry?.notes) : [],
  };
}
