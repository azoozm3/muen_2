import { pick } from "../utils";
import { generalReply } from "./common";

export function woundReply(language, flags = {}) {
  return generalReply(
    language,
    pick(language, "للجروح بشكل عام:", "For wounds in general:"),
    pick(
      language,
      [
        "إذا الجرح عميق، ينزف كثيرًا، أو يحتاج إغلاقًا، لا تؤخر التقييم الطبي.",
        "إذا الجرح بسيط، راقب النزيف والنظافة وغير الضماد عند الحاجة.",
        "إذا ظهر تورم أو احمرار شديد أو صديد، راجع طبيب.",
      ],
      [
        "If the wound is deep, bleeding heavily, or may need closure, do not delay medical evaluation.",
        "If the wound is minor, monitor bleeding and cleanliness and change the dressing when needed.",
        "If swelling, marked redness, or pus appears, see a doctor.",
      ],
    ),
    pick(language, "إذا النزيف قوي فهو أقرب للطوارئ.", "If the bleeding is heavy, it is closer to an emergency."),
    {
      urgency: flags.bleeding ? "high" : "urgent",
      action: flags.bleeding ? "emergency" : "appointment",
      topic: "wound",
      followUp: pick(language, "هل الجرح عميق أو النزيف مستمر؟", "Is the wound deep or is the bleeding ongoing?"),
    },
  );
}

export function pressureSugarReply(language, flags = {}) {
  return generalReply(
    language,
    pick(language, "إذا السؤال عن الضغط أو السكر بشكل عام:", "If your question is about blood pressure or blood sugar in general:"),
    pick(
      language,
      [
        "إذا عندك أعراض شديدة مثل دوخة قوية، إغماء، ألم صدر، ضيق تنفس، أو تشوش شديد، اطلب تقييمًا عاجلًا.",
        "إذا عندك قراءات غير طبيعية ومتكررة، احجز موعدًا مع طبيب.",
        "إذا بدك، اكتب القراءة والأعراض وسأعطيك توجيهًا عامًا.",
      ],
      [
        "If you have severe symptoms like major dizziness, fainting, chest pain, shortness of breath, or severe confusion, seek urgent evaluation.",
        "If your readings are repeatedly abnormal, book a doctor appointment.",
        "If you want, send the reading and symptoms and I’ll give general guidance.",
      ],
    ),
    pick(language, "هذا توجيه عام وليس خطة علاج.", "This is general guidance, not a treatment plan."),
    {
      urgency: flags.severe ? "urgent" : "normal",
      action: "appointment",
      topic: "pressure-sugar",
      followUp: pick(language, "ما هي القراءة؟ وهل عندك أعراض واضحة؟", "What is the reading? Do you have clear symptoms?"),
    },
  );
}
