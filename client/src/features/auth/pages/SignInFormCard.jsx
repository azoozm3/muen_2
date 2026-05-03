import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignInFormCard({ form, error, isPending, onSubmit }) {
  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Enter your email and password to continue</CardDescription>
      </CardHeader>

      <CardContent>
        {error ? <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert> : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="password" render={({ field }) => <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Enter your password" {...field} /></FormControl><FormMessage /></FormItem>} />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isPending}>
              {form.formState.isSubmitting || isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign in"}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-muted-foreground">Don&apos;t have an account? <Link href="/signup" className="font-medium text-primary hover:underline">Sign up</Link></p>
      </CardContent>
    </Card>
  );
}
