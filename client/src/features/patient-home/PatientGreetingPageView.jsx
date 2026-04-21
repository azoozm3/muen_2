import { useLocation } from "wouter";
import { QuickLinkCard, ActiveEmergencyCard, ChatbotFab, HelpButton, patientGreetingQuickLinks } from "@/features/patient-home/PatientGreetingCards";
import PatientGreetingHero from "@/features/patient-home/PatientGreetingHero";
import { useAuth } from "@/hooks/use-auth";
import { useMyEmergencyRequests } from "@/hooks/use-requests";

export default function PatientGreetingPageView() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: myEmergencyData } = useMyEmergencyRequests();
  const activeEmergency = myEmergencyData?.activeRequest || null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-8">
      <PatientGreetingHero name={user?.name || "Friend"} />

      <div className="mt-10 flex w-full max-w-lg flex-col items-center gap-6">
        <ActiveEmergencyCard activeEmergency={activeEmergency} onOpen={() => navigate(`/dashboard/patient/emergency?requestId=${activeEmergency?.id || activeEmergency?._id}`)} />
        <HelpButton onClick={() => navigate("/dashboard/patient/emergency")} />
        <QuickLinkCard {...patientGreetingQuickLinks.services} delay={0.4} onClick={() => navigate("/dashboard/patient/services")} testId="button-other-services" />
      </div>

      <div className="mt-4 w-full max-w-lg">
        <QuickLinkCard {...patientGreetingQuickLinks.profile} delay={0.5} onClick={() => navigate("/profile")} testId="button-patient-profile" />
      </div>

      <ChatbotFab onClick={() => navigate("/dashboard/patient/chatbot")} />
    </div>
  );
}
