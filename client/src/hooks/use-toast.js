import * as React from "react";
import { TOAST_REMOVE_DELAY, actionTypes, genToastId, toastReducer } from "./toastStore";

const toastTimeouts = new Map();
const listeners = [];
let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = toastReducer(memoryState, action, addToRemoveQueue);
  listeners.forEach((listener) => listener(memoryState));
}

function addToRemoveQueue(toastId) {
  if (toastTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
}

function dismissToast(toastId) {
  dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
}

function createToastControls(id) {
  return {
    id,
    dismiss: () => dismissToast(id),
    update: (props) => dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } }),
  };
}

function buildToastPayload(id, props) {
  return {
    ...props,
    id,
    open: true,
    onOpenChange: (open) => { if (!open) dismissToast(id); },
  };
}

function toast(props) {
  const id = genToastId();
  dispatch({ type: actionTypes.ADD_TOAST, toast: buildToastPayload(id, props) });
  return createToastControls(id);
}

function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { ...state, toast, dismiss: dismissToast };
}

export { useToast, toast };
