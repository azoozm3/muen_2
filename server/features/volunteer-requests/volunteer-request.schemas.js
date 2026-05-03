import { z } from "zod";
import { volunteerServiceOptions } from "../../../shared/volunteer.js";

export const createVolunteerRequestSchema = z.object({
  serviceType: z.enum(volunteerServiceOptions),
  address: z.string().min(1, "Location is required"),
  locationNote: z.string().trim().max(200).optional().default(""),
  details: z.string().trim().max(500).optional().default(""),
  urgency: z.enum(["low", "medium", "high"]).optional().default("medium"),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  patientName: z.string().trim().min(1).max(120).optional(),
  patientPhone: z.string().trim().min(1).max(30).optional(),
});

export const statusSchema = z.object({
  status: z.enum(["in_progress", "completed"]),
});

export const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().trim().max(300).optional().default(""),
});
