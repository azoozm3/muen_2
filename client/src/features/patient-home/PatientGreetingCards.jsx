import { motion } from "framer-motion";
import { ArrowRight, Bot, Briefcase, HeartPulse, MapPin, Siren, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";

export function ActiveEmergencyCard({ activeEmergency, onOpen }) {
  if (!activeEmergency) return null;

  const caseId = activeEmergency.publicCaseId || `Case #${activeEmergency.caseNumber || activeEmergency.id || activeEmergency._id}`;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <Card className="cursor-pointer rounded-2xl border-destructive/20 bg-destructive/5 p-5 hover-elevate active-elevate-2" onClick={onOpen} data-testid="card-active-emergency">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Siren className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">Your active emergency request</h2>
              <StatusBadge status={activeEmergency.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{caseId}</p>
            <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="line-clamp-2">{activeEmergency.location}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-destructive">Tap to continue tracking it as a patient.</p>
          </div>
          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
        </div>
      </Card>
    </motion.div>
  );
}

export function HelpButton({ onClick }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }} className="w-full">
      <Button data-testid="button-help" onClick={onClick} variant="destructive" className="flex w-full flex-col items-center gap-4 rounded-3xl py-16 sm:py-20">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/30 sm:h-28 sm:w-28">
          <HeartPulse className="h-12 w-12 sm:h-14 sm:w-14" />
        </div>
        <span className="text-4xl font-extrabold tracking-wide sm:text-5xl">HELP</span>
        <span className="text-base font-normal text-red-100 sm:text-lg">Tap here to fill the emergency request form</span>
      </Button>
    </motion.div>
  );
}

export function QuickLinkCard({ delay = 0.4, icon: Icon, title, description, onClick, testId }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }} className="w-full">
      <Card className="cursor-pointer rounded-2xl p-6 hover-elevate active-elevate-2" onClick={onClick} data-testid={testId}>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-7 w-7" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground" />
        </div>
      </Card>
    </motion.div>
  );
}

export function ChatbotFab({ onClick }) {
  return (
    <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 200 }} onClick={onClick} className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover-elevate active-elevate-2" data-testid="button-chatbot">
      <Bot className="h-6 w-6" />
    </motion.button>
  );
}

export const patientGreetingQuickLinks = {
  services: { icon: Briefcase, title: "Other Services", description: "Medical advice, appointments, and more" },
  profile: { icon: UserCircle, title: "My Profile", description: "View and update your personal information" },
};
