import { Link } from "wouter";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SignUpFormCard({ form, roles, isSigningUp, onSubmit }) {
  return (
    <Card className="w-full rounded-3xl p-6 sm:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UserPlus className="h-6 w-6" /></div>
        <h1 className="text-2xl font-bold">Create your Mu&apos;en account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Registration is basic for all roles. You can complete the rest later from your profile.</p>
      </div>

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="name" render={({ field }) => <FormItem><FormLabel>Full name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="phone" render={({ field }) => <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="password" render={({ field }) => <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>} />
          </div>

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>{roles.map((role) => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSigningUp}>
            {isSigningUp ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : "Create account"}
          </Button>
        </form>
      </Form>

      <p className="mt-4 text-center text-sm text-muted-foreground">Already have an account? <Link href="/signin" className="font-medium text-primary">Sign in</Link></p>
    </Card>
  );
}
