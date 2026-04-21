import {
  CalendarCheck,
  FileText,
  HandHeart,
  HeartHandshake,
  MapPin,
  Pill,
} from "lucide-react";

export const patientServices = [
  {
    icon: HeartHandshake,
    title: "Request a Nurse",
    description:
      "Book a home-care visit for blood pressure, blood sugar, pregnancy test, and follow-up care",
    color:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    path: "/dashboard/patient/nurse-requests",
  },
  {
    icon: HandHeart,
    title: "Volunteer Requests",
    description:
      "Ask for volunteer help and track your current or completed volunteer support requests",
    color:
      "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
    path: "/dashboard/patient/volunteer-requests",
  },
  {
    icon: CalendarCheck,
    title: "My Appointments",
    description:
      "See doctor responses, upcoming bookings, and review completed visits",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    path: "/dashboard/patient/appointments",
  },
  {
    icon: Pill,
    title: "Medicine Reminder",
    description: "Set reminders for your medication schedule",
    color:
      "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
    path: "/dashboard/patient/medicine-reminder",
  },
  {
    icon: MapPin,
    title: "Nearby Hospitals",
    description: "Find hospitals and clinics close to your location",
    color: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400",
    path: "/dashboard/patient/nearby-hospitals",
  },
  {
    icon: FileText,
    title: "Health Records",
    description: "View and manage your health record rows",
    color: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
    path: "/dashboard/patient/health-record",
  },
];
