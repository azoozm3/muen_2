import { useEffect, useMemo, useRef } from "react";

export function usePaypalRefs({ disabled, validate, onApproved, onError, clientId, serviceKey, currency }) {
  const ref = useRef(null);
  const buttonsActionsRef = useRef(null);
  const disabledRef = useRef(disabled);
  const validateRef = useRef(validate);
  const onApprovedRef = useRef(onApproved);
  const onErrorRef = useRef(onError);
  const renderedKey = useMemo(() => `${clientId}-${serviceKey}-${currency}`, [clientId, serviceKey, currency]);

  useEffect(() => {
    disabledRef.current = disabled;
    validateRef.current = validate;
    onApprovedRef.current = onApproved;
    onErrorRef.current = onError;
  }, [disabled, validate, onApproved, onError]);

  return { ref, buttonsActionsRef, disabledRef, validateRef, onApprovedRef, onErrorRef, renderedKey };
}
