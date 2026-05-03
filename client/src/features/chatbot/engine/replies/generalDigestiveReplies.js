import { pick } from "../utils";
import { emergencyReply, generalReply } from "./common";

export function stomachReply(language) {
  return generalReply(
    language,
    pick(
      language,
      "ألم البطن له أسباب كثيرة، لذلك نركّز على المكان والشدة والأعراض المرافقة.",
      "Stomach pain can have many causes, so it helps to focus on the location, severity, and related symptoms.",
    ),
    [
      pick(language, "خذ سوائل خفيفة ووجبات بسيطة مؤقتًا إذا كنت قادرًا على الأكل.", "Try light fluids and simple foods for now if you can eat."),
      pick(language, "لاحظ إذا الألم أعلى البطن أو أسفله، وهل معه قيء أو حرارة أو إسهال.", "Notice whether the pain is upper or lower abdomen, and whether there is vomiting, fever, or diarrhea."),
      pick(language, "إذا الألم مستمر أو يزداد، تحتاج تقييم طبي مباشر.", "If the pain keeps going or gets worse, you need medical review."),
    ],
    pick(
      language,
      "إذا الألم شديد جدًا، مع تصلب بالبطن، دم، إغماء، أو صعوبة تنفس، اعتبره طارئًا.",
      "If the pain is very severe, with a hard abdomen, blood, fainting, or trouble breathing, treat it as urgent.",
    ),
    { topic: "digestive", followUp: "duration" },
  );
}

export function diarrheaReply(language) {
  return generalReply(
    language,
    pick(language, "الإسهال أهم شيء معه هو تعويض السوائل ومراقبة علامات الجفاف.", "With diarrhea, the main focus is replacing fluids and watching for dehydration."),
    [
      pick(language, "اشرب ماء أو محلول تعويض سوائل بكميات صغيرة ومتكررة.", "Drink water or oral rehydration fluids in small frequent amounts."),
      pick(language, "خفف الأكل الدسم والحليب إذا كان يزيد الأعراض.", "Reduce greasy food and dairy if they worsen the symptoms."),
      pick(language, "إذا استمر أكثر من يومين أو كان شديدًا، تحتاج تقييم.", "If it lasts more than two days or is severe, you need evaluation."),
    ],
    pick(
      language,
      "إذا هناك دم، جفاف شديد، دوخة قوية، قلة تبول، أو حرارة عالية مستمرة، تحتاج رعاية عاجلة.",
      "If there is blood, major dehydration, strong dizziness, very little urination, or persistent high fever, you need urgent care.",
    ),
    { topic: "digestive", followUp: "duration" },
  );
}

export function vomitingReply(language) {
  return generalReply(
    language,
    pick(language, "القيء المتكرر قد يسبب جفاف بسرعة، لذلك نهتم بالسوائل أولًا.", "Repeated vomiting can cause dehydration quickly, so fluids come first."),
    [
      pick(language, "خذ رشفات صغيرة من الماء أو محلول تعويض سوائل كل عدة دقائق.", "Take small sips of water or oral rehydration solution every few minutes."),
      pick(language, "تجنب الوجبات الثقيلة حتى تهدأ المعدة.", "Avoid heavy meals until the stomach settles."),
      pick(language, "إذا لا تستطيع الاحتفاظ بأي سوائل، تحتاج تقييم طبي.", "If you cannot keep any fluids down, you need medical care."),
    ],
    pick(
      language,
      "إذا القيء مع دم، ألم شديد، جفاف واضح، أو تشوش، اعتبر الحالة عاجلة.",
      "If vomiting comes with blood, severe pain, obvious dehydration, or confusion, treat it as urgent.",
    ),
    { topic: "digestive", followUp: "duration" },
  );
}


export function allergyReply(language) {
  return generalReply(
    language,
    pick(language, "الحساسية قد تسبب طفحًا أو حكة أو عطاسًا حسب السبب.", "Allergy can cause rash, itching, or sneezing depending on the trigger."),
    [
      pick(language, "ابتعد عن الشيء الذي تعتقد أنه سبب الأعراض إذا كان معروفًا.", "Avoid the trigger if you know what started the symptoms."),
      pick(language, "إذا الأعراض خفيفة راقبها واشرح نوع الطفح أو الحكة.", "If symptoms are mild, monitor them and describe the rash or itching."),
      pick(language, "إذا في تورم بالشفاه أو صعوبة نفس فهذه حالة طارئة.", "If there is lip swelling or breathing trouble, this is an emergency."),
    ],
    pick(language, "أعراض الحساسية الشديدة تحتاج طوارئ فورًا.", "Severe allergy symptoms need emergency care immediately."),
    { topic: "allergy", followUp: "severity" },
  );
}
