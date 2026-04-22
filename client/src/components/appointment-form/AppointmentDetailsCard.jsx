import { CalendarDays, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function AppointmentDetailsCard({ doctor, form, minDate, updateField, onCancel }) {
  return (
    <Card className="rounded-2xl p-4">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">Appointment details</h3>
          <p className="text-sm text-muted-foreground">Choose date and time, then pay once to send the request.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" min={minDate} value={form.date} onChange={(e) => updateField("date", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Time</Label>
          <Input type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label>Reason</Label>
        <Textarea rows={4} value={form.reason} onChange={(e) => updateField("reason", e.target.value)} placeholder="Write a short reason for the visit" />
      </div>

      <div className="mt-4 space-y-2">
        <Label>Consultation type</Label>
        <RadioGroup value={form.appointmentType} onValueChange={(value) => updateField("appointmentType", value)} className="grid gap-2">
          {doctor?.onlineConsultation ? (
            <label className="flex items-center gap-3 rounded-2xl border p-3">
              <RadioGroupItem value="online" />
              <Video className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">Online consultation</div>
                <div className="text-sm text-muted-foreground">Video flow can be connected later.</div>
              </div>
            </label>
          ) : null}
          <label className="flex items-center gap-3 rounded-2xl border p-3">
            <RadioGroupItem value="in_person" />
            <CalendarDays className="h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">In-person visit</div>
              <div className="text-sm text-muted-foreground">Clinic or agreed location.</div>
            </div>
          </label>
        </RadioGroup>
      </div>

      <div className="mt-4 flex justify-end"><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button></div>
    </Card>
  );
}
