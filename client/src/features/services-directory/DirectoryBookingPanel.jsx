import BookAppointmentForm from "@/components/BookAppointmentForm";
import { Card } from "@/components/ui/card";

export default function DirectoryBookingPanel({ bookingRef, doctor, onSuccess, onCancel }) {
  if (!doctor) return null;
  return (
    <Card ref={bookingRef} className="mb-6 rounded-2xl border-primary/20 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Book with {doctor.name}</h2>
        <p className="text-sm text-muted-foreground">Fill in the form below. Online video connection can be implemented later.</p>
      </div>
      <BookAppointmentForm doctor={doctor} onSuccess={onSuccess} onCancel={onCancel} />
    </Card>
  );
}
