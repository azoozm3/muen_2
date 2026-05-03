import { Button } from "@/components/ui/button";
import { ArrowLeft, Stethoscope } from "lucide-react";

export default function DirectoryHeader({ onBack }) {
  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold" data-testid="text-directory-title">
          <Stethoscope className="h-6 w-6 text-primary" />
          Find a Doctor
        </h1>
        <p className="mt-1 text-muted-foreground">Browse doctors by specialty, rating, and online consultation availability.</p>
      </div>
    </>
  );
}
