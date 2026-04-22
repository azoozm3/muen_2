import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ChatbotQuickPanel({ starterPrompts, onSendPrompt, onOpenEmergency, onOpenServices }) {
  return (
    <div className="space-y-4">
      <Card className="rounded-3xl border-primary/10 p-5">
        <h2 className="text-base font-semibold">Quick start</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSendPrompt(prompt)}
              className="rounded-full border bg-white px-3 py-2 text-left text-sm transition hover:border-primary hover:text-primary"
            >
              {prompt}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <Button className="rounded-2xl" onClick={onOpenEmergency}>Open Emergency</Button>
        <Button variant="outline" className="rounded-2xl" onClick={onOpenServices}>Open Services</Button>
      </div>
    </div>
  );
}
