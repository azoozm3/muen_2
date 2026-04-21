import { hasAny, buildResponse, pick } from "./utils";
import {
  BACK_PAIN_KEYWORDS,
  BURN_KEYWORDS,
  CONSTIPATION_KEYWORDS,
  DENTAL_KEYWORDS,
  DIZZINESS_KEYWORDS,
  EAR_KEYWORDS,
  EYE_KEYWORDS,
  FATIGUE_KEYWORDS,
  NURSE_KEYWORDS,
  PRESSURE_SUGAR_KEYWORDS,
  URINARY_KEYWORDS,
  WOUND_KEYWORDS,
} from "./keywords";
import {
  backPainReply,
  burnReply,
  constipationReply,
  dentalReply,
  dizzinessReply,
  earReply,
  eyeReply,
  fatigueReply,
  pressureSugarReply,
  urinaryReply,
  woundReply,
} from "./replies/extendedSymptoms";

function nurseReply(language) {
  return buildResponse({
    language,
    urgency: "normal",
    action: "nurse",
    topic: "nurse",
    text: pick(
      language,
      "إذا كنت تحتاج خدمة منزلية أو متابعة في البيت، يمكنك استخدام طلب الممرض/الممرضة من داخل التطبيق.",
      "If you need home support or follow-up at home, you can use the nurse request service inside the app.",
    ),
  });
}

export function matchExtendedReply(normalized, language, flags) {
  if (hasAny(normalized, DIZZINESS_KEYWORDS)) return dizzinessReply(language, flags);
  if (hasAny(normalized, BACK_PAIN_KEYWORDS)) return backPainReply(language, flags);
  if (hasAny(normalized, URINARY_KEYWORDS)) return urinaryReply(language, flags);
  if (hasAny(normalized, EYE_KEYWORDS)) return eyeReply(language, flags);
  if (hasAny(normalized, EAR_KEYWORDS)) return earReply(language, flags);
  if (hasAny(normalized, DENTAL_KEYWORDS)) return dentalReply(language, flags);
  if (hasAny(normalized, CONSTIPATION_KEYWORDS)) return constipationReply(language, flags);
  if (hasAny(normalized, FATIGUE_KEYWORDS)) return fatigueReply(language, flags);
  if (hasAny(normalized, BURN_KEYWORDS)) return burnReply(language);
  if (hasAny(normalized, WOUND_KEYWORDS)) return woundReply(language, flags);
  if (hasAny(normalized, PRESSURE_SUGAR_KEYWORDS)) return pressureSugarReply(language, flags);
  if (hasAny(normalized, NURSE_KEYWORDS)) return nurseReply(language);
  return null;
}
