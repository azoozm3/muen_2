import { useEffect } from "react";
import { loadPaypalSdk } from "./sdk";

export function usePaypalButtonRender({ ref, clientId, currency, serviceKey, renderedKey, buttonsActionsRef, disabledRef, validateRef, onApprovedRef, onErrorRef, setLoading, setError }) {
  useEffect(() => {
    let cancelled = false;
    if (!ref.current || !clientId) {
      setLoading(false);
      return undefined;
    }

    ref.current.innerHTML = "";
    setLoading(true);
    setError("");

    const canContinue = () => (typeof validateRef.current === "function" ? Boolean(validateRef.current()) : !disabledRef.current);
    const fail = (message) => {
      setError(message);
      onErrorRef.current?.(message);
    };

    loadPaypalSdk(clientId, currency)
      .then((paypal) => {
        if (cancelled || !paypal?.Buttons) return;
        return paypal.Buttons({
          style: { layout: "vertical", shape: "rect", label: "paypal" },
          onInit: (_data, actions) => {
            buttonsActionsRef.current = actions;
            if (canContinue()) actions.enable();
            else actions.disable();
          },
          onClick: (_data, actions) => {
            if (!canContinue()) {
              const message = "Complete the form first";
              fail(message);
              return actions.reject();
            }
            setError("");
            return actions.resolve();
          },
          createOrder: async () => {
            if (!canContinue()) throw new Error("Complete the form first");
            const res = await fetch("/api/payments/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ serviceKey }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Failed to create PayPal order");
            return data.orderId;
          },
          onApprove: async (data) => {
            const res = await fetch("/api/payments/capture", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ orderId: data.orderID, serviceKey }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result?.message || "Failed to capture payment");
            await onApprovedRef.current?.(data.orderID, result);
          },
          onError: (err) => fail(err?.message || "PayPal failed"),
        }).render(ref.current);
      })
      .catch((err) => {
        if (!cancelled) fail(err.message || "Failed to load PayPal");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      buttonsActionsRef.current = null;
    };
  }, [buttonsActionsRef, clientId, currency, disabledRef, onApprovedRef, onErrorRef, ref, renderedKey, serviceKey, setError, setLoading, validateRef]);
}
