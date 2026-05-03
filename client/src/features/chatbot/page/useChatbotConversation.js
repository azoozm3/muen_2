import { useEffect, useMemo, useRef, useState } from "react";
import { buildChatbotReply, getStarterPrompts } from "@/features/chatbot/engine";

const initialMessages = [
  {
    id: 1,
    role: "bot",
    urgency: "normal",
    text: "Hi! Ask me directly about symptoms, medicine, appointments, or emergency signs.",
  },
];

export function useChatbotConversation() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const listRef = useRef(null);
  const starterPrompts = useMemo(() => getStarterPrompts(), []);

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  function sendMessage(customText) {
    const text = String(customText ?? inputValue).trim();
    if (!text) return;

    const userMessage = { id: Date.now(), role: "user", text, urgency: "normal" };
    const reply = buildChatbotReply(text);
    const botMessage = {
      id: Date.now() + 1,
      role: "bot",
      text: reply.text,
      urgency: reply.urgency,
    };

    setMessages((current) => [...current, userMessage, botMessage]);
    setInputValue("");
  }

  return {
    inputValue,
    listRef,
    messages,
    sendMessage,
    setInputValue,
    starterPrompts,
  };
}
