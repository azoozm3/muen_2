import { motion } from "framer-motion";
import { ArrowLeft, Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/features/chatbot/ChatMessage";
import { ChatbotQuickPanel } from "./ChatbotQuickPanel";

export function ChatbotPageView({
  inputValue,
  listRef,
  messages,
  onBack,
  onChangeInput,
  onOpenEmergency,
  onOpenServices,
  onSendMessage,
  starterPrompts,
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4">
        <div>
          <Button variant="ghost" onClick={onBack} data-testid="button-back-dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid flex-1 gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="flex min-h-[70vh] flex-col overflow-hidden rounded-3xl border-primary/10">
            <div className="border-b bg-primary/5 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Medical Chat</h1>
                </div>
              </div>
            </div>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4">
              {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
            </div>

            <div className="border-t bg-white p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask directly..."
                  value={inputValue}
                  onChange={(event) => onChangeInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      onSendMessage();
                    }
                  }}
                  data-testid="input-chatbot"
                  className="flex-1 rounded-xl"
                />
                <Button onClick={() => onSendMessage()} data-testid="button-chatbot-send" className="rounded-xl">
                  <Send className="mr-2 h-4 w-4" /> Send
                </Button>
              </div>
            </div>
          </Card>

          <ChatbotQuickPanel
            starterPrompts={starterPrompts}
            onSendPrompt={onSendMessage}
            onOpenEmergency={onOpenEmergency}
            onOpenServices={onOpenServices}
          />
        </motion.div>
      </div>
    </div>
  );
}
