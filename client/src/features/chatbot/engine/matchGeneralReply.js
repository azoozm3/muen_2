import { hasAny } from "./utils";
import {
  ALLERGY_KEYWORDS,
  APPOINTMENT_KEYWORDS,
  COUGH_KEYWORDS,
  FEVER_KEYWORDS,
  HEADACHE_KEYWORDS,
  MEDICINE_KEYWORDS,
  STOMACH_KEYWORDS,
} from "./keywords";
import {
  allergyReply,
  appointmentReply,
  coughReply,
  feverReply,
  headacheReply,
  medicineReply,
  stomachReply,
} from "./replies/generalSymptoms";

export function matchGeneralReply(normalized, language, flags) {
  if (hasAny(normalized, APPOINTMENT_KEYWORDS)) return appointmentReply(language);
  if (hasAny(normalized, MEDICINE_KEYWORDS)) return medicineReply(language, flags);
  if (hasAny(normalized, FEVER_KEYWORDS)) return feverReply(language, flags);
  if (hasAny(normalized, COUGH_KEYWORDS)) return coughReply(language, flags);
  if (hasAny(normalized, HEADACHE_KEYWORDS)) return headacheReply(language, flags);
  if (hasAny(normalized, STOMACH_KEYWORDS)) return stomachReply(language, flags);
  if (hasAny(normalized, ALLERGY_KEYWORDS)) return allergyReply(language, flags);
  return null;
}
