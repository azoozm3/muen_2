import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Stethoscope } from "lucide-react";
import DoctorDirectoryCard from "./DoctorDirectoryCard";

export default function DoctorDirectoryResults({ doctors, isLoading, hasActiveFilters, clearFilters, onBook }) {
  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!doctors?.length) {
    return (
      <Card className="p-8 text-center">
        <Stethoscope className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
        <h3 className="text-lg font-semibold">No Doctors Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters.</p>
        {hasActiveFilters ? <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4" data-testid="button-clear-filters-empty">Clear All Filters</Button> : null}
      </Card>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground" data-testid="text-result-count">{doctors.length} doctor{doctors.length !== 1 ? "s" : ""} found</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{doctors.map((doctor, index) => <DoctorDirectoryCard key={doctor.id} doctor={doctor} index={index} onBook={onBook} />)}</div>
    </>
  );
}
