import { pick } from "../utils";
import { generalReply } from "./common";

export function eyeReply(language, flags = {}) {
  return generalReply(
    language,
    pick(language, "لاحمرار أو ألم العين بشكل عام:", "For eye redness or eye pain in general:"),
    pick(
      language,
      [
        "تجنب فرك العين.",
        "إذا في ألم شديد، ضعف نظر، أو إصابة مباشرة للعين، اطلب تقييمًا طبيًا بسرعة.",
        "إذا الاحمرار خفيف فقط راقب الأعراض.",
      ],
      [
        "Avoid rubbing the eye.",
        "If there is severe pain, reduced vision, or a direct injury to the eye, seek medical evaluation quickly.",
        "If the redness is mild only, monitor the symptoms.",
      ],
    ),
    pick(language, "هذه نصيحة عامة وليست تشخيصًا نهائيًا.", "This is general advice, not a final diagnosis."),
    {
      urgency: flags.severe ? "urgent" : "normal",
      action: flags.severe ? "appointment" : "none",
      topic: "eye",
      followUp: pick(language, "هل يوجد إفرازات أو ضعف في النظر؟", "Is there discharge or reduced vision?"),
    },
  );
}

export function earReply(language, flags = {}) {
  return generalReply(
    language,
    pick(language, "لألم الأذن بشكل عام:", "For ear pain in general:"),
    pick(
      language,
      [
        "راقب الألم وتجنب إدخال أي شيء داخل الأذن.",
        "إذا يوجد حرارة، إفرازات، أو ألم شديد، راجع طبيب.",
        "إذا الحالة خفيفة راقبها لفترة قصيرة.",
      ],
      [
        "Monitor the pain and avoid putting anything into the ear.",
        "If there is fever, discharge, or severe pain, see a doctor.",
        "If the symptoms are mild, observe them for a short period.",
      ],
    ),
    pick(language, "إذا استمر الألم، الأفضل حجز موعد.", "If the pain continues, it is better to book an appointment."),
    {
      urgency: flags.severe ? "urgent" : "normal",
      action: flags.severe || flags.duration ? "appointment" : "none",
      topic: "ear",
      followUp: pick(language, "هل هناك حرارة أو إفرازات من الأذن؟", "Is there fever or any discharge from the ear?"),
    },
  );
}

export function dentalReply(language, flags = {}) {
  return generalReply(
    language,
    pick(language, "لألم الأسنان بشكل عام:", "For tooth pain in general:"),
    pick(
      language,
      [
        "حافظ على نظافة الفم وتجنب الأكل الذي يزيد الألم.",
        "إذا في تورم، حرارة، أو ألم شديد جدًا، راجع طبيب أو طبيب أسنان بسرعة.",
        "إذا الألم مستمر، لا تؤجل الموعد.",
      ],
      [
        "Keep the mouth clean and avoid foods that worsen the pain.",
        "If there is swelling, fever, or very severe pain, see a doctor or dentist soon.",
        "If the pain continues, do not delay an appointment.",
      ],
    ),
    pick(language, "هذه نصيحة عامة وليست علاجًا نهائيًا.", "This is general advice, not a final treatment."),
    {
      urgency: flags.severe ? "urgent" : "normal",
      action: "appointment",
      topic: "dental",
      followUp: pick(language, "هل يوجد تورم في الوجه أو اللثة؟", "Is there swelling in the face or gums?"),
    },
  );
}
