import { buildResponse, pick } from "../utils";
import { generalReply } from "./common";

export function appointmentReply(language) {
  return buildResponse({
    language,
    urgency: "normal",
    action: "appointment",
    topic: "appointment",
    text: pick(
      language,
      "إذا الحالة ليست طارئة لكن تحتاج تقييم، الأفضل تحجز موعد مع الطبيب من داخل التطبيق. وإذا كنت تحتاج خدمة منزلية، يمكنك استخدام طلب الممرض/الممرضة.",
      "If the issue is not an emergency but needs evaluation, the best step is to book a doctor appointment inside the app. If you need home support, you can use the nurse request service.",
    ),
  });
}

export function medicineReply(language, flags) {
  const extra =
    flags.pregnant || flags.child
      ? pick(
          language,
          " بما أن الحالة تخص حملًا أو طفلًا، الأفضل يكون القرار النهائي للطبيب أو الصيدلي.",
          " Since this may involve pregnancy or a child, the final decision should come from a doctor or pharmacist.",
        )
      : "";

  return buildResponse({
    language,
    urgency: "normal",
    action: "appointment",
    topic: "medicine",
    text: pick(
      language,
      `أقدر أعطيك معلومات عامة عن الدواء، لكن لا أعطي جرعات دقيقة أو وصفة علاجية. اكتب اسم الدواء واستخدامه أو المشكلة التي تسأل عنها.${extra}`,
      `I can give general medicine information, but I should not provide exact dosing or a full prescription. Tell me the medicine name and what you want to know about it.${extra}`,
    ),
  });
}

export function feverReply(language, flags) {
  if (flags.child) {
    return generalReply(
      language,
      "إذا الطفل عنده حرارة بشكل عام:",
      [
        "أعطه سوائل وراقب نشاطه وتنفسه.",
        "إذا الحرارة عالية جدًا، أو الطفل خامل، أو يرفض الشرب، أو عنده صعوبة تنفس، راجع طبيب بسرعة.",
        "إذا كان عمره صغير جدًا أو أنت قلق، لا تؤخر التقييم الطبي.",
      ],
      "هذا توجيه عام وليس تشخيصًا نهائيًا.",
      {
        urgency: flags.severe ? "urgent" : "normal",
        action: "appointment",
        topic: "fever",
        followUp: "هل الطفل نشيط ويشرب سوائل بشكل طبيعي؟",
      },
    );
  }

  return generalReply(
    language,
    pick(
      language,
      "إذا عندك حرارة أو أعراض برد بشكل عام:",
      "If you have fever or common cold symptoms in general:",
    ),
    pick(
      language,
      [
        "اشرب سوائل كثير وخذ راحة.",
        "راقب الحرارة، وإذا استمرت أكثر من يومين أو ثلاثة راجع طبيب.",
        "إذا الحرارة عالية جدًا أو معها ضيق تنفس أو خمول شديد استخدم الطوارئ أو اطلب تقييمًا عاجلًا.",
      ],
      [
        "Drink fluids and rest well.",
        "Monitor the temperature, and if it lasts more than 2 to 3 days, book a doctor appointment.",
        "If the fever is very high or comes with breathing difficulty or extreme weakness, seek urgent medical care.",
      ],
    ),
    pick(
      language,
      "هذا توجيه عام وليس تشخيصًا نهائيًا.",
      "This is general guidance, not a final diagnosis.",
    ),
    {
      urgency: flags.severe ? "urgent" : "normal",
      action: flags.severe ? "appointment" : "none",
      topic: "fever",
      followUp: pick(
        language,
        "هل الحرارة معها كحة أو ألم حلق أو ألم جسم؟",
        "Is the fever with cough, sore throat, or body aches?",
      ),
    },
  );
}
