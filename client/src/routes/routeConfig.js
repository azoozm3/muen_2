import Landing from "@/pages/Landing";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import PatientGreeting from "@/pages/PatientGreeting";
import Patient from "@/pages/Patient";
import PatientServices from "@/pages/PatientServices";
import PatientAppointments from "@/pages/PatientAppointments";
import PatientChatbot from "@/pages/PatientChatbot";
import MedicineReminder from "@/pages/MedicineReminder";
import NearbyHospitals from "@/pages/NearbyHospitals";
import PatientHealthRecord from "@/pages/PatientHealthRecord";
import PatientNurseRequests from "@/pages/PatientNurseRequests";
import PatientVolunteerRequests from "@/pages/PatientVolunteerRequests";
import DoctorDashboard from "@/pages/Doctor";
import DoctorAppointments from "@/pages/DoctorAppointments";
import NurseDashboard from "@/pages/NurseDashboard";
import VolunteerDashboard from "@/pages/VolunteerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ProfilePage from "@/pages/ProfilePage";
import ServicesDirectory from "@/pages/ServicesDirectory";
import ProviderPublicProfile from "@/pages/ProviderPublicProfile";
import PatientPublicProfile from "@/pages/PatientPublicProfile";

export const publicRoutes = [
  { path: "/", component: Landing },
  { path: "/signup", component: SignUp },
  { path: "/signin", component: SignIn },
];

export const protectedRoutes = [
  { path: "/profile", component: ProfilePage },
  { path: "/dashboard/patient", component: PatientGreeting, allowedRoles: ["patient"] },
  { path: "/dashboard/patient/emergency", component: Patient, allowedRoles: ["patient"] },
  { path: "/dashboard/patient/services", component: PatientServices, allowedRoles: ["patient"] },
  { path: "/dashboard/patient/appointments", component: PatientAppointments, allowedRoles: ["patient"] },
  { path: "/dashboard/patient/doctors", component: ServicesDirectory, allowedRoles: ["patient"] },
  { path: "/dashboard/patient/chatbot", component: PatientChatbot, allowedRoles: ["patient"] },
  { path: "/dashboard/patient/medicine-reminder", component: MedicineReminder, allowedRoles: ["patient"] },
  { path: "/dashboard/patient/nearby-hospitals", component: NearbyHospitals, allowedRoles: ["patient"] },
  { path: "/dashboard/patient/health-record", component: PatientHealthRecord, allowedRoles: ["patient"] },
  { path: "/dashboard/patient/nurse-requests", component: PatientNurseRequests, allowedRoles: ["patient"] },
  { path: "/dashboard/patient/volunteer-requests", component: PatientVolunteerRequests, allowedRoles: ["patient"] },
  { path: "/provider/:id", component: ProviderPublicProfile, allowedRoles: ["patient", "doctor", "nurse", "volunteer", "admin"] },
  { path: "/doctor/:id", component: ProviderPublicProfile, allowedRoles: ["patient", "doctor", "nurse", "volunteer", "admin"] },
  { path: "/nurse/:id", component: ProviderPublicProfile, allowedRoles: ["patient", "doctor", "nurse", "volunteer", "admin"] },
  { path: "/volunteer/:id", component: ProviderPublicProfile, allowedRoles: ["patient", "doctor", "nurse", "volunteer", "admin"] },
  { path: "/patient/:id", component: PatientPublicProfile, allowedRoles: ["doctor", "nurse", "volunteer", "admin", "patient"] },
  { path: "/dashboard/doctor", component: DoctorDashboard, allowedRoles: ["doctor"] },
  { path: "/dashboard/doctor/services", component: DoctorAppointments, allowedRoles: ["doctor"] },
  { path: "/dashboard/doctor/appointments", component: DoctorAppointments, allowedRoles: ["doctor"] },
  { path: "/dashboard/nurse", component: NurseDashboard, allowedRoles: ["nurse"] },
  { path: "/dashboard/volunteer", component: VolunteerDashboard, allowedRoles: ["volunteer"] },
  { path: "/dashboard/admin", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/users", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/doctors", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/nurses", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/patients", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/volunteers", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/requests", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/emergency-requests", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/nurse-requests", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/volunteer-requests", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/appointments", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/payments", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/analytics", component: AdminDashboard, allowedRoles: ["admin"] },
  { path: "/dashboard/admin/settings", component: AdminDashboard, allowedRoles: ["admin"] },
];
