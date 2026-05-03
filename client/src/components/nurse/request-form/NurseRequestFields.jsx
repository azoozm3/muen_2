import { Loader2, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getToday } from "./constants";

export function NurseRequestFields({ form, updateField, onUseCurrentLocation, isGettingLocation }) {
  return (
    <Card className="rounded-2xl p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Service</span>
          <select value={form.serviceType} onChange={(event) => updateField("serviceType", event.target.value)} className="h-10 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-primary">
            <option>General Care</option>
            <option>Injection</option>
            <option>Wound Care</option>
            <option>Vital Signs</option>
            <option>Elderly Care</option>
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span>Date</span>
          <Input type="date" min={getToday()} value={form.requestedDate} onChange={(event) => updateField("requestedDate", event.target.value)} required />
        </label>

        <label className="space-y-2 text-sm">
          <span>Time</span>
          <Input type="time" value={form.requestedTime} onChange={(event) => updateField("requestedTime", event.target.value)} required />
        </label>

        <label className="space-y-2 text-sm">
          <span>Address</span>
          <Input type="text" value={form.address} onChange={(event) => updateField("address", event.target.value)} placeholder="Address" />
        </label>

        <div className="rounded-2xl border bg-muted/20 p-4 text-sm md:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Label>Location</Label>
            <Button type="button" variant="outline" size="sm" className="w-full gap-2 sm:w-auto" onClick={onUseCurrentLocation} disabled={isGettingLocation}>
              {isGettingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPinned className="h-4 w-4" />}
              {form.locationLat && form.locationLng ? "Location pinned" : isGettingLocation ? "Getting..." : "Use my location"}
            </Button>
          </div>
          <Input className="mt-3" type="text" value={form.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Optional note like building, floor, or landmark" />
        </div>

        <label className="space-y-2 text-sm md:col-span-2">
          <span>Note</span>
          <Textarea value={form.note} onChange={(event) => updateField("note", event.target.value)} className="min-h-[110px]" placeholder="Short note" />
        </label>
      </div>
    </Card>
  );
}
