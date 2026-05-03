import { useCallback, useEffect, useState } from "react";

export function useEditableSyncState(source, buildValue) {
  const getNextValue = useCallback(
    (nextSource) => buildValue(nextSource),
    [buildValue],
  );

  const [value, setValueState] = useState(() => getNextValue(source));
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isDirty) {
      setValueState(getNextValue(source));
    }
  }, [getNextValue, isDirty, source]);

  const setValue = useCallback((updater) => {
    setIsDirty(true);
    setValueState((currentValue) => (
      typeof updater === "function" ? updater(currentValue) : updater
    ));
  }, []);

  const resetValue = useCallback((nextSource = source) => {
    setIsDirty(false);
    setValueState(getNextValue(nextSource));
  }, [getNextValue, source]);

  return {
    value,
    setValue,
    resetValue,
    isDirty,
    setIsDirty,
  };
}
