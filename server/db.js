import "dotenv/config";
import mongoose from "mongoose";
import { serverEnv } from "./config/app-env.js";

export async function connectDB() {
  if (!serverEnv.mongoUri) {
    throw new Error("MONGODB_URI must be set");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(serverEnv.mongoUri, {
    dbName: serverEnv.mongoDbName,
  });

  console.log(`MongoDB connected (${serverEnv.mongoDbName})`);
}
