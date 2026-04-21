import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { AuthShell } from "@/features/auth/pages/AuthShell";
import { SignInFormCard } from "@/features/auth/pages/SignInFormCard";

function resolveRedirectByRole(user) {
  if (user?.role === "patient") return "/dashboard/patient";
  if (user?.role === "doctor") return "/dashboard/doctor";
  if (user?.role === "nurse") return "/dashboard/nurse";
  if (user?.role === "admin") return "/dashboard/admin";
  return "/";
}

export default function SignIn() {
  const [, setLocation] = useLocation();
  const { signIn, signInPending } = useAuth();
  const [error, setError] = useState("");
  const form = useForm({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values) => {
    setError("");
    try {
      const user = await signIn(values);
      setLocation(resolveRedirectByRole(user));
    } catch (err) {
      setError(err?.message || "Something went wrong");
    }
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 p-2"><img src="/favicon.png" alt="mu'en logo" className="h-full w-full object-contain" /></div>
          <div><h1 className="text-2xl font-bold tracking-tight">mu&apos;en</h1><p className="text-sm text-muted-foreground">Sign in to your account</p></div>
        </div>
        <SignInFormCard form={form} error={error} isPending={signInPending} onSubmit={onSubmit} />
      </div>
    </AuthShell>
  );
}
