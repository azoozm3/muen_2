import { serverEnv } from "../../config/app-env.js";

export const DEFAULT_SETTINGS = {
  singletonKey: "default",
  servicePricing: {
    appointment: { label: "Doctor Appointment", price: 15, platformFee: 5, currency: "USD", active: true },
    nurseRequest: { label: "Home Nurse Visit", price: 25, platformFee: 5, currency: "USD", active: true },
  },
  paymentProvider: {
    provider: "paypal",
    mode: serverEnv.paypalMode,
    paypalClientIdPublic: serverEnv.paypalClientId,
  },
};
