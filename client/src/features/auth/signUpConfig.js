import { z } from "zod";

export const signUpRoles = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "nurse", label: "Nurse" },
  { value: "volunteer", label: "Volunteer" },
];

export const signUpSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(6, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor", "nurse", "volunteer"]),
});
