import mongoose from "mongoose";
import { defaultSchemaOptions } from "../lib/mongoose-utils.js";

const noteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, trim: true },
    requestId: { type: String, required: true, trim: true },
    requestPublicId: { type: String, default: "", trim: true },
    content: { type: String, required: true, trim: true },
  },
  defaultSchemaOptions,
);

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
