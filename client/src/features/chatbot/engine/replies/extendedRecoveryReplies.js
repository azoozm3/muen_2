import { pick } from "../utils";
import { generalReply } from "./common";

export function constipationReply(language, flags = {}) {
  return generalReply(
    language,
    pick(language, "للإمساك بشكل عام:", "For constipation in general:"),
    pick(
      language,
      [
        "اشرب ماء أكثر وحاول زيادة الأكل الخفيف الغني بالألياف إذا كان مناسبًا لك.",
        "إذا يوجد ألم شديد، قيء، أو انتفاخ شديد، راجع طبيب بسرعة.",
        "إذا استمرت المشكلة، احجز موعدًا.",
      ],
      [
        "Drink more water and try increasing light fiber-rich foods if suitable for you.",
        "If there is severe pain, vomiting, or marked bloating, see a doctor soon.",
        "If the problem continues, book an appointment.",
      ],
    ),
    pick(language, "هذا توجيه عام وليس تشخيصًا.", "This is general guidance, not a diagnosis."),
    {
      urgency: flags.severe ? "urgent" : "normal",
      action: flags.duration ? "appointment" : "none",
      topic: "constipation",
      followUp: pick(language, "منذ متى بدأت المشكلة؟ وهل يوجد ألم شديد؟", "How long has this been happening? Is there severe pain?"),
    },
  );
}

export function fatigueReply(language, flags = {}) {
  return generalReply(
    language,
    pick(language, "للتعب العام بشكل عام:", "For general fatigue in general:"),
    pick(
      language,
      [
        "خذ راحة جيدة واشرب ماء وراقب النوم والأكل.",
        "إذا التعب شديد جدًا أو مستمر أو معه ضيق تنفس أو دوخة قوية، راجع طبيب.",
        "إذا الأعراض بسيطة، راقبها لفترة قصيرة.",
      ],
      [
        "Get good rest, drink water, and pay attention to sleep and food.",
        "If the fatigue is very severe or ongoing, or with breathing difficulty or strong dizziness, see a doctor.",
        "If symptoms are mild, monitor them for a short time.",
      ],
    ),
    pick(language, "إذا استمر التعب، الأفضل تقييم طبي.", "If the fatigue continues, medical evaluation is better."),
    {
      urgency: flags.severe ? "urgent" : "normal",
      action: flags.duration ? "appointment" : "none",
      topic: "fatigue",
      followUp: pick(language, "هل يوجد حرارة أو فقدان شهية أو دوخة؟", "Is there fever, loss of appetite, or dizziness?"),
    },
  );
}

export function burnReply(language) {
  return generalReply(
    language,
    pick(language, "للحروق البسيطة بشكل عام:", "For minor burns in general:"),
    pick(
      language,
      [
        "إذا كان الحرق بسيطًا، ابعد السبب فورًا واطلب تقييمًا إذا الألم قوي أو المساحة كبيرة.",
        "إذا الحرق كبير، عميق، في الوجه، أو بسبب كهرباء/مواد كيميائية، فهذا يحتاج تقييمًا عاجلًا.",
        "لا تعتمد على الشات وحده في الحروق المتوسطة أو الشديدة.",
      ],
      [
        "If the burn is minor, remove the cause immediately and seek evaluation if the pain is strong or the area is large.",
        "If the burn is large, deep, on the face, or caused by electricity or chemicals, it needs urgent evaluation.",
        "Do not rely on chat alone for moderate or severe burns.",
      ],
    ),
    pick(language, "عند الشك، اطلب تقييمًا طبيًا.", "When in doubt, seek medical evaluation."),
    { urgency: "urgent", action: "appointment", topic: "burn", followUp: pick(language, "هل الحرق صغير وسطحي أم كبير أو عميق؟", "Is the burn small and superficial, or large or deep?") },
  );
}
