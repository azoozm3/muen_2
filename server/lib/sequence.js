import mongoose from "mongoose";

const sequenceSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },
    seq: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Sequence = mongoose.models.Sequence || mongoose.model("Sequence", sequenceSchema);

export async function getNextIdentity(key) {
  const updated = await Sequence.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
  );

  return updated;
}

export { Sequence };
