import { z } from "zod";

export const updateRoleSchema = z.object({
  role: z.enum(["patient", "doctor", "nurse", "volunteer", "admin"]),
});

export const toggleStatusSchema = z.object({
  active: z.boolean(),
});

export const markProviderPayoutSchema = z.object({
  providerType: z.enum(["doctor", "nurse"]),
  providerId: z.string().min(1),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(["patient", "doctor", "nurse", "volunteer", "admin"]).optional(),
  active: z.boolean().optional(),
});

const pricingRowSchema = z.object({
  label: z.string().min(1).optional(),
  price: z.coerce.number().min(0).optional(),
  platformFee: z.coerce.number().min(0).optional(),
  currency: z.string().min(1).optional(),
  active: z.boolean().optional(),
});

export const updateServiceSettingsSchema = z.object({
  servicePricing: z.object({
    appointment: pricingRowSchema.optional(),
    nurseRequest: pricingRowSchema.optional(),
  }).optional().default({}),
  paymentProvider: z.object({
    provider: z.string().min(1).optional(),
    mode: z.string().min(1).optional(),
    paypalClientIdPublic: z.string().optional(),
  }).optional().default({}),
});
