import { HeartHandshake, Loader2, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { volunteerServices, volunteerUrgencies } from "@/features/volunteer-requests/volunteerUtils";

export default function PatientVolunteerRequestFormCard({ form, updateForm, isLocating, loading, onCaptureLocation, onClose, onSubmit }) {
  return (
    <Card className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><HeartHandshake className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-semibold">New Request</h2>
            <p className="text-sm text-muted-foreground">Same clean request style as nurse services, adapted for volunteer help.</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full sm:w-auto" onClick={onClose}>Close</Button>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input value={form.patientName} onChange={(e) => updateForm("patientName", e.target.value)} placeholder="Full name" />
          <Input value={form.patientPhone} onChange={(e) => updateForm("patientPhone", e.target.value)} placeholder="Phone number" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select value={form.serviceType} onValueChange={(value) => updateForm("serviceType", value)}>
            <SelectTrigger><SelectValue placeholder="Choose service" /></SelectTrigger>
            <SelectContent>{volunteerServices.map((service) => <SelectItem key={service} value={service}>{service}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={form.urgency} onValueChange={(value) => updateForm("urgency", value)}>
            <SelectTrigger><SelectValue placeholder="Urgency" /></SelectTrigger>
            <SelectContent>{volunteerUrgencies.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <label className="space-y-2 text-sm">
          <span>Address</span>
          <Input value={form.address} onChange={(e) => updateForm("address", e.target.value)} placeholder="Address" />
        </label>
        <div className="rounded-2xl border bg-muted/20 p-4 text-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Label>Location</Label>
            <Button type="button" variant="outline" size="sm" className="w-full gap-2 sm:w-auto" onClick={onCaptureLocation} disabled={isLocating}>
              {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPinned className="h-4 w-4" />}
              {form.latitude != null && form.longitude != null ? "Location pinned" : isLocating ? "Getting..." : "Use my location"}
            </Button>
          </div>
          <Input className="mt-3" value={form.locationNote} onChange={(e) => updateForm("locationNote", e.target.value)} placeholder="Optional note like building, floor, or landmark" />
        </div>

        <Textarea value={form.details} onChange={(e) => updateForm("details", e.target.value)} placeholder="Describe the help you need" rows={4} />

        <Button type="submit" className="w-full sm:w-auto" disabled={loading || !form.patientName.trim() || !form.patientPhone.trim() || !form.address.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send request"}
        </Button>
      </form>
    </Card>
  );
}
