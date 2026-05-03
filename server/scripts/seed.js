import "dotenv/config";
import { connectDB } from "../db.js";
import { seedDatabase } from "../seed/index.js";
import { prepareStorage, storage } from "../storage/index.js";

async function run() {
  await connectDB();
  await seedDatabase(storage);
  await prepareStorage(storage);
  console.log("Seed completed");
  process.exit(0);
}

run().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
