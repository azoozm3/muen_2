import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { signUpRoles as roles, signUpSchema as schema } from "@/features/auth/signUpConfig";
import { AuthShell } from "@/features/auth/pages/AuthShell";
import { SignUpFormCard } from "@/features/auth/pages/SignUpFormCard";

export default function SignUp() {
  const [, navigate] = useLocation();
  const { signUp, isSigningUp } = useAuth();
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", phone: "", password: "", role: "patient" } });

  const onSubmit = async (values) => {
    await signUp(values);
    navigate("/");
  };

  return (
    <AuthShell compact>
      <SignUpFormCard form={form} roles={roles} isSigningUp={isSigningUp} onSubmit={onSubmit} />
    </AuthShell>
  );
}
