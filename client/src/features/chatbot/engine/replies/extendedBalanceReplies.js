import { pick } from "../utils";
import { generalReply } from "./common";

export function dizzinessReply(language, flags) {
  return generalReply(
    language,
    pick(language, "للدوخة بشكل عام:", "For dizziness in general:"),
    pick(
      language,
      [
        "اجلس أو استلقِ قليلًا واشرب ماء.",
        "إذا الدوخة مع إغماء، ألم صدر، ضيق تنفس، أو ضعف شديد فهذا طارئ.",
        "إذا كانت تتكرر أو لا تتحسن، احجز موعدًا مع طبيب.",
      ],
      [
        "Sit or lie down for a while and drink water.",
        "If dizziness comes with fainting, chest pain, shortness of breath, or severe weakness, treat it as an emergency.",
        "If it keeps happening or does not improve, book a doctor appointment.",
      ],
    ),
    pick(
      language,
      "هذا توجيه عام وليس تشخيصًا نهائيًا.",
      "This is general guidance, not a final diagnosis.",
    ),
    {
      urgency: flags.severe ? "urgent" : "normal",
      action: flags.severe || flags.duration ? "appointment" : "none",
      topic: "dizziness",
      followUp: pick(
        language,
        "هل الدوخة مع صداع أو خفقان أو ضعف؟",
        "Is the dizziness with headache, palpitations, or weakness?",
      ),
    },
  );
}

export function backPainReply(language, flags) {
  return generalReply(
    language,
    pick(language, "لألم الظهر بشكل عام:", "For back pain in general:"),
    pick(
      language,
      [
        "خفف الجهد وخذ راحة نسبية.",
        "إذا الألم شديد جدًا، أو بعد سقوط/حادث، أو معه ضعف أو تنميل شديد، راجع طبيب بسرعة.",
        "إذا استمر الألم أو تكرر كثيرًا، احجز موعدًا.",
      ],
      [
        "Reduce strain and take relative rest.",
        "If the pain is very severe, after a fall/accident, or with major weakness or numbness, seek medical care soon.",
        "If the pain continues or keeps returning, book an appointment.",
      ],
    ),
    pick(
      language,
      "الجواب عام وليس بديلًا عن الفحص.",
      "This answer is general and does not replace medical assessment.",
    ),
    {
      urgency: flags.severe ? "urgent" : "normal",
      action: flags.severe || flags.duration ? "appointment" : "none",
      topic: "back-pain",
      followUp: pick(
        language,
        "هل الألم بعد حمل شيء ثقيل أو بعد سقوط؟",
        "Did the pain start after lifting something heavy or after a fall?",
      ),
    },
  );
}

export function urinaryReply(language, flags) {
  return generalReply(
    language,
    pick(
      language,
      "لأعراض البول مثل الحرقة أو كثرة التبول بشكل عام:",
      "For urinary symptoms like burning or frequent urination in general:",
    ),
    pick(
      language,
      [
        "اشرب ماء بشكل جيد.",
        "إذا في حرارة، ألم شديد، ألم بالجنب، أو دم في البول، راجع طبيب بسرعة.",
        "إذا الأعراض بسيطة لكنها مستمرة، احجز موعدًا.",
      ],
      [
        "Drink enough water.",
        "If there is fever, severe pain, side pain, or blood in the urine, see a doctor soon.",
        "If symptoms are mild but persistent, book an appointment.",
      ],
    ),
    pick(
      language,
      "لأن هذه الحالة قد تحتاج تقييمًا، لا تؤخر الموعد إذا استمرت الأعراض.",
      "Because this may need evaluation, do not delay an appointment if symptoms continue.",
    ),
    {
      urgency: flags.severe ? "urgent" : "normal",
      action: "appointment",
      topic: "urinary",
      followUp: pick(
        language,
        "هل يوجد حرارة أو ألم في الظهر أو الجنب؟",
        "Is there fever or pain in the back or side?",
      ),
    },
  );
}
