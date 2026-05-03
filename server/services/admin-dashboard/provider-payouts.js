import { Appointment, NurseRequest } from "../../storage/models.js";

export async function markProviderPayoutsAsPaid({ providerType, providerId, adminId = "" }) {
  if (!providerId) {
    throw new Error("Provider id is required");
  }

  const normalizedType = providerType === "doctor" ? "doctor" : providerType === "nurse" ? "nurse" : "";
  if (!normalizedType) {
    throw new Error("Provider type must be doctor or nurse");
  }

  const Model = normalizedType === "doctor" ? Appointment : NurseRequest;
  const providerField = normalizedType === "doctor" ? "doctorId" : "nurseId";

  const result = await Model.updateMany(
    {
      [providerField]: providerId,
      status: "completed",
      "payment.status": "captured",
      $or: [
        { "payment.providerPayoutStatus": { $exists: false } },
        { "payment.providerPayoutStatus": { $ne: "paid" } },
      ],
    },
    {
      $set: {
        "payment.providerPayoutStatus": "paid",
        "payment.providerPayoutAt": new Date(),
        "payment.providerPayoutMarkedBy": adminId,
      },
    },
  );

  return {
    modifiedCount: result?.modifiedCount ?? result?.nModified ?? 0,
  };
}
