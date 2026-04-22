import { CreditCard, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import PayPalCheckout from "@/components/payment/PayPalCheckout";

export function AppointmentPaymentCard({ pricing, paypalClientId, canSubmit, isSubmitting, doctorId, form, onApproved, onError }) {
  const currency = pricing?.currency || "USD";
  const providerNet = pricing?.providerNet ?? ((pricing?.price ?? 15) - (pricing?.platformFee ?? 5));

  return (
    <Card className="rounded-2xl p-4">
      <div className="mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">Payment</h3>
          <p className="text-sm text-muted-foreground">Patient pays once, then the doctor receives their share.</p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border p-4 text-sm">
        <div className="flex items-center justify-between"><span>Service</span><span>{pricing?.label || "Doctor Appointment"}</span></div>
        <div className="flex items-center justify-between"><span>Total</span><span>{pricing?.price ?? 15} {currency}</span></div>
        <div className="flex items-center justify-between text-muted-foreground"><span>Platform fee</span><span>{pricing?.platformFee ?? 5} {currency}</span></div>
        <div className="flex items-center justify-between text-muted-foreground"><span>Doctor gets</span><span>{providerNet} {currency}</span></div>
      </div>

      {!paypalClientId ? <p className="mt-4 text-sm text-amber-600">Add PAYPAL_CLIENT_ID in the server .env to enable PayPal checkout.</p> : null}

      <div className="mt-4">
        <PayPalCheckout
          clientId={paypalClientId}
          serviceKey="appointment"
          currency="USD"
          disabled={!canSubmit || isSubmitting}
          validate={() => Boolean(doctorId && form.date && form.time)}
          onApproved={onApproved}
          onError={onError}
        />
      </div>

      {!canSubmit ? <p className="mt-3 text-sm text-muted-foreground">Choose date and time before paying.</p> : null}
      {isSubmitting ? <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Finalizing appointment…</div> : null}
    </Card>
  );
}
