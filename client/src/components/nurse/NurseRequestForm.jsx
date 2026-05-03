import { useServiceSettings } from "@/hooks/use-service-settings";
import { useToast } from "@/hooks/use-toast";
import { NursePaymentCard } from "./request-form/NursePaymentCard";
import { NurseRequestFields } from "./request-form/NurseRequestFields";
import { useNurseRequestForm } from "./request-form/useNurseRequestForm";

export default function NurseRequestForm({ onSubmit, isSubmitting }) {
  const { toast } = useToast();
  const { data: serviceSettings } = useServiceSettings();
  const pricing = serviceSettings?.servicePricing?.nurseRequest;
  const paypalClientId = serviceSettings?.paymentProvider?.paypalClientIdPublic;
  const { form, canSubmit, isGettingLocation, updateField, resetForm, handleUseCurrentLocation } = useNurseRequestForm({ toast });

  const finalizeRequest = async (paymentOrderId) => {
    await onSubmit({
      serviceType: form.serviceType,
      requestedDate: form.requestedDate,
      requestedTime: form.requestedTime,
      address: form.address.trim(),
      location: form.location.trim(),
      locationNote: form.location.trim(),
      locationLat: form.locationLat,
      locationLng: form.locationLng,
      note: form.note.trim(),
      paymentOrderId,
    });
    resetForm();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <NurseRequestFields form={form} updateField={updateField} onUseCurrentLocation={handleUseCurrentLocation} isGettingLocation={isGettingLocation} />
      <NursePaymentCard
        pricing={pricing}
        paypalClientId={paypalClientId}
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        isGettingLocation={isGettingLocation}
        form={form}
        onApproved={async (orderId) => {
          try {
            await finalizeRequest(orderId);
          } catch (error) {
            toast({ title: "Request failed", description: error.message || "Please try again.", variant: "destructive" });
          }
        }}
        onError={(message) => toast({ title: "PayPal error", description: message, variant: "destructive" })}
      />
    </div>
  );
}
