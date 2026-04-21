import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useServiceSettings } from "@/hooks/use-service-settings";
import { AppointmentDetailsCard } from "./appointment-form/AppointmentDetailsCard";
import { AppointmentPaymentCard } from "./appointment-form/AppointmentPaymentCard";
import { useBookAppointmentForm } from "./appointment-form/useBookAppointmentForm";

export default function BookAppointmentForm({ doctor, onSuccess, onCancel }) {
  const { toast } = useToast();
  const { data: settings } = useServiceSettings();
  const pricing = settings?.servicePricing?.appointment;
  const paypalClientId = settings?.paymentProvider?.paypalClientIdPublic;
  const { form, doctorId, minDate, canSubmit, updateField } = useBookAppointmentForm(doctor);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalizeBooking = async (paymentOrderId) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ doctorId, doctorName: doctor.name, specialty: doctor.specialty || "", date: form.date, time: form.time, reason: form.reason, appointmentType: form.appointmentType, paymentOrderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to book appointment");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/appointments"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/appointments", "patient"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/appointments", "doctor"] }),
      ]);
      onSuccess?.(data);
    } catch (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <AppointmentDetailsCard doctor={doctor} form={form} minDate={minDate} updateField={updateField} onCancel={onCancel} />
      <AppointmentPaymentCard
        pricing={pricing}
        paypalClientId={paypalClientId}
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        doctorId={doctorId}
        form={form}
        onApproved={async (orderId) => { await finalizeBooking(orderId); }}
        onError={(message) => toast({ title: "PayPal error", description: message, variant: "destructive" })}
      />
    </div>
  );
}
