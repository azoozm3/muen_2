import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ReminderForm, ReminderList, ReminderStats } from "@/features/medicine-reminder/ReminderSections";
import { createReminderId, emptyReminderForm, getNextReminder, getStoredReminders, persistReminders } from "@/features/medicine-reminder/reminderUtils";

export default function MedicineReminder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState(emptyReminderForm);

  useEffect(() => {
    setReminders(getStoredReminders());
  }, []);

  useEffect(() => {
    persistReminders(reminders);
  }, [reminders]);

  const activeCount = useMemo(() => reminders.filter((item) => item.enabled).length, [reminders]);
  const nextReminder = useMemo(() => getNextReminder(reminders), [reminders]);

  const handleChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const resetForm = () => setForm(emptyReminderForm);

  const handleAddReminder = () => {
    if (!form.medicineName.trim() || !form.time) {
      toast({ title: "Missing details", description: "Please add at least the medicine name and time.", variant: "destructive" });
      return;
    }

    const newReminder = {
      id: createReminderId(),
      medicineName: form.medicineName.trim(),
      dosage: form.dosage.trim() || "Not specified",
      time: form.time,
      frequency: form.frequency,
      enabled: true,
      notes: form.notes.trim(),
    };

    setReminders((current) => [newReminder, ...current]);
    resetForm();
    toast({ title: "Reminder added", description: `${newReminder.medicineName} was scheduled successfully.` });
  };

  const handleDeleteReminder = (id) => {
    const reminder = reminders.find((item) => item.id === id);
    setReminders((current) => current.filter((item) => item.id !== id));
    toast({ title: "Reminder deleted", description: reminder ? `${reminder.medicineName} was removed.` : "Reminder removed." });
  };

  const handleToggleReminder = (id) => {
    setReminders((current) => current.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Medicine Reminder</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">Add your medicines, set reminder times, and keep track of your daily schedule.</p>
            </div>
            <ReminderStats activeCount={activeCount} totalCount={reminders.length} nextTime={nextReminder?.time} />
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}><ReminderForm form={form} onChange={handleChange} onSave={handleAddReminder} /></motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}><ReminderList reminders={reminders} onToggle={handleToggleReminder} onDelete={handleDeleteReminder} /></motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }} className="mt-6">
          <Card className="rounded-2xl border-primary/10 bg-primary/5"><CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">Today</p><p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p></div><p className="text-sm text-muted-foreground">Your reminders are saved in this browser and stay available after refresh.</p></CardContent></Card>
        </motion.div>
      </div>
    </div>
  );
}
