import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PatientVolunteerRequestsHeader({ onBack, onNewRequest, showForm }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>

        <h1 className="text-2xl font-bold">Volunteer Requests</h1>
        <p className="text-sm text-muted-foreground">Ask for transport, medication pickup, or practical support with your live location.</p>
      </div>
      {!showForm ? <Button className="w-full sm:w-auto" onClick={onNewRequest}>New Request</Button> : null}
    </div>
  );
}
