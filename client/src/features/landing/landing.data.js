import {
  Activity,
  CalendarCheck,
  Clock3,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Stethoscope,
  UserRoundPlus,
} from "lucide-react";

export const heroData = {
  badge: "Medical support",
  title: "Mu'en helps patients reach the right support faster.",
  description:
    "One platform for emergency requests, doctor appointments, home nursing, and volunteer support with a calmer, clearer experience.",
  primaryAction: {
    label: "Get started",
    href: "/auth",
  },
  secondaryAction: {
    label: "How it works",
    href: "#how-it-works",
  },
};

export const heroHighlights = [
  {
    icon: HeartHandshake,
    title: "Core experience",
    description: "Emergency, appointments, nurse, volunteer",
  },
  {
    icon: ShieldCheck,
    title: "Emergency-first flow",
    description: "Simple and direct support when fast action matters.",
  },
  {
    icon: Clock3,
    title: "Fast request steps",
    description: "Clear forms and quick actions without extra complexity.",
  },
  {
    icon: Activity,
    title: "Care in one place",
    description: "Track requests, visits, and support from one platform.",
  },
];

export const aboutData = {
  eyebrow: "About Mu'en",
  title: "Healthcare support platform.",
  description:
    "Mu'en is designed for patients and families who want fast access to help without confusion. It combines emergency support, scheduled care, home nursing, and volunteer assistance in a straightforward flow that feels usable from the first screen.",
};

export const servicesData = [
  {
    icon: Activity,
    title: "Emergency support",
    description: "Send an urgent medical help request with your location.",
  },
  {
    icon: CalendarCheck,
    title: "Doctor appointments",
    description: "Book in-person or online doctor appointments easily.",
  },
  {
    icon: Stethoscope,
    title: "Nurse home service",
    description: "Request nursing support at home for follow-up care.",
  },
  {
    icon: HeartHandshake,
    title: "Volunteer help",
    description: "Ask for practical support like transport or pickup.",
  },
  {
    icon: MapPin,
    title: "Nearby hospitals",
    description: "Find hospitals and clinics close to your location.",
  },
  {
    icon: UserRoundPlus,
    title: "Health records",
    description: "Keep your health information easier to review and manage.",
  },
];

export const workflowSteps = [
  {
    number: "01",
    title: "Choose the help you need",
    description:
      "Select emergency support, doctor appointments, nurse service, or volunteer help.",
  },
  {
    number: "02",
    title: "Share your request",
    description:
      "Enter the needed details and location so the right person can respond faster.",
  },
  {
    number: "03",
    title: "Get connected quickly",
    description:
      "Nearby providers or volunteers receive the request and can respond directly.",
  },
  {
    number: "04",
    title: "Track your support",
    description:
      "Follow your request status, appointments, and completed support in one place.",
  },
];

export const ctaData = {
  title: "Start with a calmer way to request care.",
  description:
    "Mu'en keeps medical support clear, simple, and easier to reach when it matters.",
  primaryAction: {
    label: "Create account",
    href: "/auth",
  },
  secondaryAction: {
    label: "Sign in",
    href: "/auth",
  },
};

export const footerData = {
  brand: "mu'en",
  text: "Bringing healthcare support into one simple, clear experience.",
};
