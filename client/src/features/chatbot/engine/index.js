import { detectLanguage, hasAny, normalizeText } from "./utils";
import { extractFlags, isEmergencyCase } from "./triage";
import { emptyReply, getStarterPrompts, greetingReply } from "./starters";
import { GREETING_KEYWORDS } from "./keywords";
import { emergencyReply, fallbackReply } from "./replies/common";
import { matchGeneralReply } from "./matchGeneralReply";
import { matchExtendedReply } from "./matchExtendedReply";

export { getStarterPrompts };

export function buildChatbotReply(message) {
  const trimmed = String(message || "").trim();
  const normalized = normalizeText(trimmed);
  const language = detectLanguage(trimmed);
  const flags = extractFlags(normalized);

  if (!trimmed) return emptyReply(language);
  if (hasAny(normalized, GREETING_KEYWORDS)) return greetingReply(language);
  if (isEmergencyCase(normalized, flags)) return emergencyReply(language);

  const generalReply = matchGeneralReply(normalized, language, flags);
  if (generalReply) return generalReply;

  const extendedReply = matchExtendedReply(normalized, language, flags);
  if (extendedReply) return extendedReply;

  return fallbackReply(language);
}
