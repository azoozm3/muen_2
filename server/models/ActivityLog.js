import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    userName: {
      type: String,
      default: null,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    details: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);
