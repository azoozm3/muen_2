import mongoose from "mongoose";
import { defaultSchemaOptions } from "../lib/mongoose-utils.js";

const servicePricingSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    platformFee: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, default: "USD" },
    active: { type: Boolean, default: true },
  },
  { _id: false },
);

const paymentProviderSchema = new mongoose.Schema(
  {
    provider: { type: String, default: "paypal", trim: true },
    mode: { type: String, default: "sandbox", trim: true },
    paypalClientIdPublic: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const appSettingsSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, unique: true, default: "default" },
    servicePricing: {
      appointment: {
        type: servicePricingSchema,
        default: { label: "Doctor Appointment", price: 15, platformFee: 5, currency: "USD", active: true },
      },
      nurseRequest: {
        type: servicePricingSchema,
        default: { label: "Home Nurse Visit", price: 25, platformFee: 5, currency: "USD", active: true },
      },
    },
    paymentProvider: {
      type: paymentProviderSchema,
      default: { provider: "paypal", mode: "sandbox", paypalClientIdPublic: "" },
    },
    updatedByUserId: { type: String, default: null },
    updatedByName: { type: String, default: null },
  },
  defaultSchemaOptions,
);

const AppSettings = mongoose.models.AppSettings || mongoose.model("AppSettings", appSettingsSchema);

export default AppSettings;
