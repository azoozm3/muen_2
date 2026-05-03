export const arabicRegex = /[\u0600-\u06FF]/;

export function hasAny(text, keywords = []) {
  return keywords.some((keyword) => text.includes(keyword));
}

export function detectLanguage(text) {
  return arabicRegex.test(text) ? "ar" : "en";
}

export function normalizeText(text) {
  return String(text || "")
    .trim()
    .toLowerCase();
}

export function pick(language, ar, en) {
  return language === "ar" ? ar : en;
}

export function buildResponse({
  language,
  text,
  urgency = "normal",
  action = "none",
  followUp = null,
  topic = "general",
}) {
  return {
    text,
    urgency,
    action,
    followUp,
    topic,
  };
}
