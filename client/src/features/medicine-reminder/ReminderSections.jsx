import { motion } from "framer-motion";
import { Bell, CalendarDays, CheckCircle2, Clock3, Pill, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { frequencies } from "./reminderUtils";

export function ReminderStats({ activeCount, totalCount, nextTime }) {
  const cards = [
    { label: "Active", value: activeCount, icon: Bell },
    { label: "Total", value: totalCount, icon: Pill },
    { label: "Next", value: nextTime || "None", icon: Clock3 },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="rounded-2xl border-primary/15">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
            <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-xl font-bold">{value}</p></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ReminderForm({ form, onChange, onSave }) {
  return (
    <Card className="rounded-2xl border-primary/15 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl"><Plus className="h-5 w-5" /> Add Reminder</CardTitle>
        <CardDescription>Create a medication reminder in a few seconds.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label htmlFor="medicineName">Medicine name</Label><Input id="medicineName" placeholder="e.g. Amoxicillin" value={form.medicineName} onChange={(e) => onChange("medicineName", e.target.value)} data-testid="input-medicine-name" /></div>
        <div className="space-y-2"><Label htmlFor="dosage">Dosage</Label><Input id="dosage" placeholder="e.g. 1 tablet" value={form.dosage} onChange={(e) => onChange("dosage", e.target.value)} data-testid="input-medicine-dosage" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="time">Time</Label><Input id="time" type="time" value={form.time} onChange={(e) => onChange("time", e.target.value)} data-testid="input-medicine-time" /></div>
          <div className="space-y-2"><Label htmlFor="frequency">Frequency</Label><select id="frequency" value={form.frequency} onChange={(e) => onChange("frequency", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" data-testid="select-medicine-frequency">{frequencies.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>
        </div>
        <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Input id="notes" placeholder="e.g. After dinner" value={form.notes} onChange={(e) => onChange("notes", e.target.value)} data-testid="input-medicine-notes" /></div>
        <Button onClick={onSave} className="w-full rounded-xl" data-testid="button-save-reminder"><Plus className="mr-2 h-4 w-4" /> Save Reminder</Button>
      </CardContent>
    </Card>
  );
}

export function ReminderList({ reminders, onToggle, onDelete }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Your Reminders</CardTitle>
        <CardDescription>Review, pause, or delete your medicine schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center"><CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground" /><h3 className="text-lg font-semibold">No reminders yet</h3><p className="mt-1 text-sm text-muted-foreground">Add your first medication reminder from the form on the left.</p></div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder, index) => (
              <motion.div key={reminder.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} layout>
                <Card className="rounded-2xl border-border/70">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400"><Pill className="h-6 w-6" /></div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-bold">{reminder.medicineName}</h3><Badge variant={reminder.enabled ? "default" : "secondary"}>{reminder.enabled ? "Active" : "Paused"}</Badge></div>
                          <p className="mt-1 text-sm text-muted-foreground">Dosage: {reminder.dosage}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> {reminder.time}</span><span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {reminder.frequency}</span></div>
                          {reminder.notes ? <p className="mt-2 text-sm text-muted-foreground">Note: {reminder.notes}</p> : null}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end lg:self-auto">
                        <div className="flex items-center gap-2 rounded-xl border px-3 py-2"><span className="text-sm text-muted-foreground">On</span><Switch checked={reminder.enabled} onCheckedChange={() => onToggle(reminder.id)} data-testid={`switch-reminder-${reminder.id}`} /></div>
                        <Button variant="outline" size="icon" className="rounded-xl" onClick={() => onDelete(reminder.id)} data-testid={`button-delete-reminder-${reminder.id}`}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
