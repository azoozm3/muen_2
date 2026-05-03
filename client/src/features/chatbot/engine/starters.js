import { buildResponse, pick } from "./utils";

export function getStarterPrompts() {
  return [
    "I have a headache",
    "عندي حرارة وسعال",
    "When should I go to emergency?",
    "هل أحتاج موعد مع دكتور؟",
    "My child has fever",
    "عندي ألم معدة من أمس",
  ];
}

export function emptyReply(language) {
  return buildResponse({
    language,
    urgency: "normal",
    action: "none",
    topic: "empty",
    text: pick(
      language,
      "اكتب سؤالك الطبي بشكل بسيط، مثل: عندي حرارة، صداع، كحة، ألم معدة، دوخة، أو متى أحتاج أراجع طبيب.",
      "Ask your health question in a simple way, like: I have fever, headache, cough, stomach pain, dizziness, or when should I see a doctor?",
    ),
  });
}

export function greetingReply(language) {
  return buildResponse({
    language,
    urgency: "low",
    action: "none",
    topic: "greeting",
    text: pick(
      language,
      "أهلًا، أنا المساعد الطبي داخل Mu'en. اسألني مباشرة بالعربي أو الإنجليزي عن الأعراض أو متى تحتاج موعد أو طوارئ، وسأعطيك جوابًا مختصرًا وواضحًا.",
      "Hi, I’m the medical assistant inside Mu'en. Ask me directly in Arabic or English about symptoms, whether you need an appointment, or when it may be urgent, and I’ll give you a short clear answer.",
    ),
  });
}
