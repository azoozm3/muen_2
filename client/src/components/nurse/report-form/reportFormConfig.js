export const CONDITION_OPTIONS = [
  { value: "stable", label: "Stable" },
  { value: "improved", label: "Improved" },
  { value: "needs_follow_up", label: "Needs follow-up" },
  { value: "urgent", label: "Urgent" },
];

export const CARE_OPTIONS = [
  "Blood pressure check",
  "Blood sugar check",
  "Temperature check",
  "Pulse check",
  "Pregnancy test",
  "Wound care",
  "Medication help",
  "Home follow-up",
];

export const RECOMMENDATION_OPTIONS = [
  { value: "home_care", label: "Continue home care" },
  { value: "follow_up", label: "Follow up later" },
  { value: "see_doctor", label: "Visit a doctor" },
  { value: "go_hospital", label: "Go to hospital" },
];

export const MEASUREMENT_OPTIONS = [
  { value: "bloodPressure", label: "Blood Pressure", placeholder: "120/80" },
  { value: "bloodSugar", label: "Blood Sugar", placeholder: "e.g. 95 mg/dL" },
  { value: "temperature", label: "Temperature", placeholder: "e.g. 37°C" },
  { value: "pulse", label: "Pulse", placeholder: "e.g. 80 bpm" },
  { value: "pregnancyTest", label: "Pregnancy Test", placeholder: "Positive / Negative" },
  { value: "other", label: "Other Test", placeholder: "Result" },
];

export const EMPTY_REPORT = {
  quickCondition: "",
  careChecklist: [],
  followUpPlan: "",
  recommendation: "",
  recommendationNotes: "",
  generalCondition: "",
  careProvided: "",
  bloodPressure: "",
  bloodSugar: "",
  temperature: "",
  pulse: "",
  pregnancyTest: "",
  measurements: [],
  adviceItems: [],
};

export const createAdviceItem = () => ({ name: "", dosage: "", frequency: "", duration: "", notes: "" });
export const createMeasurement = () => ({ type: "bloodPressure", value: "", note: "" });
