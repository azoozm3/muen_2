export const TOAST_LIMIT = 1;
export const TOAST_REMOVE_DELAY = 1000000;

export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;
export function genToastId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export function toastReducer(state, action, addToRemoveQueue) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case actionTypes.UPDATE_TOAST:
      return { ...state, toasts: state.toasts.map((toast) => toast.id === action.toast.id ? { ...toast, ...action.toast } : toast) };
    case actionTypes.DISMISS_TOAST:
      if (action.toastId) addToRemoveQueue(action.toastId);
      else state.toasts.forEach((toast) => addToRemoveQueue(toast.id));
      return { ...state, toasts: state.toasts.map((toast) => toast.id === action.toastId || action.toastId === undefined ? { ...toast, open: false } : toast) };
    case actionTypes.REMOVE_TOAST:
      return { ...state, toasts: action.toastId === undefined ? [] : state.toasts.filter((toast) => toast.id !== action.toastId) };
    default:
      return state;
  }
}
