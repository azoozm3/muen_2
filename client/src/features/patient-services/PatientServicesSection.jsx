import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

export function PatientServicesHeader({ name = "Friend" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Our Services</h1>
      <p className="mt-2 text-muted-foreground">Hi {name}, explore our additional services below.</p>
    </motion.div>
  );
}

export function FindDoctorCard({ onClick }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
      <Card className="cursor-pointer rounded-xl border-primary/20 p-5 hover-elevate active-elevate-2" onClick={onClick} data-testid="button-find-doctor">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Search className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <h2 className="text-xl font-bold">Find a Doctor</h2>
            <p className="text-sm text-muted-foreground">Browse doctors, book appointments, and contact the right specialist quickly.</p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </div>
      </Card>
    </motion.div>
  );
}

export function PatientServiceGrid({ items, onOpen }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((service, index) => {
        const Icon = service.icon;
        return (
          <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + index * 0.05 }}>
            <Card className="cursor-pointer rounded-xl p-5 hover-elevate active-elevate-2" onClick={() => onOpen(service.path)} data-testid={`card-service-${index}`}>
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${service.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-4 flex justify-end">
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>

            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
