import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Settings,
  Shield,
  Stethoscope,
  HandHeart,
  UserRound,
  Users,
} from "lucide-react";

export const ADMIN_SECTIONS = [
  { key: "dashboard", label: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
  { key: "users", label: "Users", path: "/dashboard/admin/users", icon: Users },
  { key: "doctors", label: "Doctors", path: "/dashboard/admin/doctors", icon: Stethoscope },
  { key: "nurses", label: "Nurses", path: "/dashboard/admin/nurses", icon: Shield },
  { key: "patients", label: "Patients", path: "/dashboard/admin/patients", icon: UserRound },
  { key: "volunteers", label: "Volunteers", path: "/dashboard/admin/volunteers", icon: HandHeart },
  { key: "emergency-requests", label: "Emergency", path: "/dashboard/admin/emergency-requests", icon: AlertTriangle },
  { key: "nurse-requests", label: "Nurse Requests", path: "/dashboard/admin/nurse-requests", icon: Shield },
  { key: "volunteer-requests", label: "Volunteer Requests", path: "/dashboard/admin/volunteer-requests", icon: HandHeart },
  { key: "appointments", label: "Appointments", path: "/dashboard/admin/appointments", icon: CalendarDays },
  { key: "payments", label: "Payments", path: "/dashboard/admin/payments", icon: CreditCard },
  { key: "analytics", label: "Reports", path: "/dashboard/admin/analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", path: "/dashboard/admin/settings", icon: Settings },
];

export const ADMIN_ROLE_FILTERS = {
  users: "all",
  doctors: "doctor",
  nurses: "nurse",
  patients: "patient",
  volunteers: "volunteer",
};
