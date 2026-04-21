import { pick } from "../utils";
import { emergencyReply, generalReply } from "./common";

export function coughReply(language) {
  return generalReply(
    language,
    pick(
      language,
      "الكحة غالبًا تتحسن بالراحة، السوائل، ومراقبة الأعراض المرافقة.",
      "Cough often improves with rest, fluids, and watching the symptoms around it.",
    ),
    [
      pick(language, "اشرب سوائل دافئة وخذ راحة كافية.", "Drink warm fluids and get enough rest."),
      pick(language, "إذا في بلغم، لاحظ لونه وهل يوجد صفير أو ألم صدر.", "If there is mucus, note the color and whether there is wheezing or chest pain."),
      pick(language, "إذا الكحة مستمرة أكثر من 1–2 أسبوع أو تزداد، تحتاج تقييم طبي.", "If the cough lasts more than 1–2 weeks or gets worse, it needs medical review."),
    ],
    pick(
      language,
      "إذا الكحة مع ضيق نفس، ازرقاق، ألم صدر شديد، أو سعال مع دم، اعتبرها حالة طارئة.",
      "If the cough comes with shortness of breath, blue lips, severe chest pain, or coughing blood, treat it as urgent.",
    ),
    { topic: "respiratory", followUp: "duration" },
  );
}

export function headacheReply(language) {
  return generalReply(
    language,
    pick(language, "الصداع قد يكون من إجهاد، قلة نوم، جفاف، أو توتر.", "Headache can happen from stress, poor sleep, dehydration, or tension."),
    [
      pick(language, "اشرب ماء وخذ راحة في مكان هادئ.", "Drink water and rest in a quiet place."),
      pick(language, "إذا عندك تاريخ ضغط مرتفع أو الصداع جديد وشديد جدًا، انتبه.", "If you have high blood pressure or this is a new severe headache, be careful."),
      pick(language, "يمكن استخدام مسكن بسيط إذا كان مناسبًا لك ولم يمنعك طبيب منه.", "A simple pain reliever may help if it is safe for you and not restricted by your doctor."),
    ],
    pick(
      language,
      "إذا الصداع مفاجئ جدًا، مع ضعف، تشوش كلام، قيء متكرر، أو بعد ضربة قوية على الرأس، اطلب طوارئ.",
      "If the headache is suddenly very severe, or comes with weakness, speech trouble, repeated vomiting, or after a hard head injury, seek urgent help.",
    ),
    { topic: "pain", followUp: "duration" },
  );
}

export function backPainReply(language) {
  return generalReply(
    language,
    pick(language, "ألم الظهر كثيرًا يكون من شد عضلي أو وضعية خاطئة.", "Back pain is often related to muscle strain or posture."),
    [
      pick(language, "خفف الجهد الشديد مؤقتًا لكن لا تبقَ ثابتًا طول اليوم.", "Reduce heavy effort for a while, but do not stay still all day."),
      pick(language, "جرّب كمادات دافئة وتمدد خفيف إذا لا يزيد الألم.", "Try warm compresses and gentle stretching if they do not worsen the pain."),
      pick(language, "إذا الألم نازل للساق مع خدر أو ضعف، اذكر ذلك للطبيب.", "If the pain goes down the leg with numbness or weakness, mention that to a doctor."),
    ],
    pick(
      language,
      "إذا ألم الظهر مع فقدان تحكم بالبول أو البراز، ضعف شديد بالساقين، أو بعد حادث قوي، تحتاج تقييم عاجل.",
      "If back pain comes with loss of bladder or bowel control, major leg weakness, or after serious trauma, you need urgent evaluation.",
    ),
    { topic: "pain", followUp: "duration" },
  );
}
