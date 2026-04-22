import { Button } from "@/components/ui/button";
import { ArrowLeft, Stethoscope } from "lucide-react";

export default function DirectoryHeader({ onBack }) {
  return (
    <>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4" data-testid="button-back-services">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Services
      </Button>
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
