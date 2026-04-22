import { buildResponse, pick } from "../utils";

export function emergencyReply(language) {
  return buildResponse({
    language,
    urgency: "high",
    action: "emergency",
    topic: "emergency",
    text: pick(
      language,
      "إذا في ألم صدر شديد، صعوبة تنفس، نزيف قوي، فقدان وعي، تشنجات، ضعف مفاجئ في جهة من الجسم، أو أعراض جلطة، لا تنتظر الشات. استخدم طلب الطوارئ فورًا أو اذهب لأقرب مستشفى.",
      "If there is severe chest pain, trouble breathing, heavy bleeding, loss of consciousness, seizures, sudden weakness on one side, or stroke-like symptoms, do not rely on chat. Use Emergency Request now or go to the nearest hospital.",
    ),
  });
}

export function generalReply(language, intro, steps, ending, options = {}) {
  return buildResponse({
    language,
    urgency: options.urgency || "normal",
    action: options.action || "none",
    followUp: options.followUp || null,
    topic: options.topic || "general",
    text: `${intro}\n\n• ${steps.join("\n• ")}\n\n${ending}`,
  });
}

export function fallbackReply(language) {
  return buildResponse({
    language,
    urgency: "normal",
    action: "none",
    topic: "fallback",
    text: pick(
      language,
      "فهمت الموضوع بشكل عام. اكتب الأعراض الأساسية بكلمات بسيطة مثل: حرارة، كحة، صداع، ألم بطن، دوخة، طفح، ألم أذن، دواء، أو مدة الأعراض، وأنا أعطيك جوابًا أوضح. وإذا الحالة طارئة استخدم طلب الطوارئ مباشرة.",
      "I understood the general topic. Tell me the main symptoms in simple words like fever, cough, headache, stomach pain, dizziness, rash, ear pain, medicine, or how long it has been happening, and I’ll give a clearer answer. If it feels urgent, use Emergency Request directly.",
    ),
  });
}
