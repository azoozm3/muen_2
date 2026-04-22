import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePaypalButtonRender } from "./paypal/usePaypalButtonRender";
import { usePaypalRefs } from "./paypal/usePaypalRefs";

export default function PayPalCheckout({ clientId, serviceKey, currency = "USD", disabled = false, validate, onApproved, onError }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refs = usePaypalRefs({ disabled, validate, onApproved, onError, clientId, serviceKey, currency });

  useEffect(() => {
    const actions = refs.buttonsActionsRef.current;
    if (!actions) return;
    const isBlocked = typeof refs.validateRef.current === "function" ? !refs.validateRef.current() : refs.disabledRef.current;
    if (isBlocked) actions.disable();
    else actions.enable();
  }, [disabled, refs.buttonsActionsRef, refs.disabledRef, refs.validateRef, validate]);

  usePaypalButtonRender({ ...refs, clientId, currency, serviceKey, setLoading, setError });

  return (
    <div className="space-y-3">
      {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading PayPal…</div> : null}
      <div ref={refs.ref} />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
