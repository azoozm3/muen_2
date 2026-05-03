import bcrypt from "bcrypt";
import { doctorSeedData, reviewerNames, reviewComments } from "./data.js";

const DEFAULT_SEED_DOCTOR_PASSWORD = "doctor123";

function randomPhone() {
  return `+1-555-${Math.floor(1000 + Math.random() * 9000)}`;
}

function randomAddress() {
  return `${Math.floor(100 + Math.random() * 900)} Medical Center Dr`;
}

async function createSampleReviews(storage, doctor) {
  const reviewCount = 3 + Math.floor(Math.random() * 5);

  for (let i = 0; i < reviewCount; i += 1) {
    await storage.createReview({
      doctorId: doctor.id,
      patientId: doctor.id,
      patientName: reviewerNames[i % reviewerNames.length],
      rating: 3 + Math.floor(Math.random() * 3),
      comment: reviewComments[i % reviewComments.length],
    });
  }

  await storage.updateDoctorRating(doctor.id);
}

async function seedDoctors(storage) {
  const existingDoctor = await storage.getUserByEmail("dr.chen@muen.com");
  if (existingDoctor) {
    const reviews = await storage.getReviews(existingDoctor.id);
    if (reviews.length === 0) {
      const doctors = await storage.getDoctors({});
      for (const doctor of doctors) {
        await createSampleReviews(storage, doctor);
      }
    }
    return;
  }

  const doctorPassword = process.env.SEED_DOCTOR_PASSWORD || DEFAULT_SEED_DOCTOR_PASSWORD;
  const passwordHash = await bcrypt.hash(doctorPassword, 10);
  for (const doctorData of doctorSeedData) {
    const doctor = await storage.createUser(doctorData.name, doctorData.email, passwordHash, "doctor");
    await storage.updateProfile(doctor.id, {
      specialty: doctorData.specialty,
      bio: doctorData.bio,
      phone: randomPhone(),
      address: randomAddress(),
    });
    await createSampleReviews(storage, doctor);
  }
}

export async function seedDatabase(storage) {
  const adminSeedPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminExists = await storage.getUserByEmail("admin@muen.com");
  if (!adminExists && adminSeedPassword) {
    const passwordHash = await bcrypt.hash(adminSeedPassword, 10);
    await storage.createUser("System Admin", "admin@muen.com", passwordHash, "admin");
  }

  await seedDoctors(storage);
}
