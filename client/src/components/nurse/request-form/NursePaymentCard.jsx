import { CreditCard, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import PayPalCheckout from "@/components/payment/PayPalCheckout";

export function NursePaymentCard({ pricing, paypalClientId, canSubmit, isSubmitting, isGettingLocation, form, onApproved, onError }) {
  const currency = pricing?.currency || "USD";
  const providerNet = pricing?.providerNet ?? ((pricing?.price ?? 10) - (pricing?.platformFee ?? 3));

  return (
    <Card className="rounded-2xl p-4">
      <div className="mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">Payment</h3>
          <p className="text-sm text-muted-foreground">Pay once to send the nurse request.</p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border p-4 text-sm">
        <div className="flex items-center justify-between"><span>Service</span><span>{pricing?.label || "Home Nurse Visit"}</span></div>
        <div className="flex items-center justify-between"><span>Total</span><span>{pricing?.price ?? 10} {currency}</span></div>
        <div className="flex items-center justify-between text-muted-foreground"><span>Platform fee</span><span>{pricing?.platformFee ?? 3} {currency}</span></div>
        <div className="flex items-center justify-between text-muted-foreground"><span>Nurse gets</span><span>{providerNet} {currency}</span></div>
      </div>

      {!paypalClientId ? <p className="mt-4 text-sm text-amber-600">Add PAYPAL_CLIENT_ID in the server .env to enable PayPal checkout.</p> : null}

      <div className="mt-4">
        <PayPalCheckout clientId={paypalClientId} serviceKey="nurseRequest" currency="USD" disabled={!canSubmit || isSubmitting || isGettingLocation} onApproved={onApproved} onError={onError} />
      </div>

      {!canSubmit ? <p className="mt-3 text-sm text-muted-foreground">Fill service, date, time, and address before paying.</p> : null}
      {form.locationLat && form.locationLng ? <p className="mt-3 text-sm text-muted-foreground">Live pin attached.</p> : null}
      {isSubmitting ? <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Finalizing request…</div> : null}
    </Card>
  );
}
