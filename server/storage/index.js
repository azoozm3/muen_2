import { adminStorageMethods } from "./admin.storage.js";
import { appointmentStorageMethods } from "./appointment.storage.js";
import { requestStorageMethods } from "./request.storage.js";
import { reviewStorageMethods } from "./review.storage.js";
import { sequenceStorageMethods } from "./sequence.storage.js";
import { userStorageMethods } from "./user.storage.js";

export class DatabaseStorage {}

Object.assign(
  DatabaseStorage.prototype,
  sequenceStorageMethods,
  userStorageMethods,
  requestStorageMethods,
  appointmentStorageMethods,
  reviewStorageMethods,
  adminStorageMethods,
);

export const storage = new DatabaseStorage();

export async function prepareStorage(storageInstance = storage) {
  await storageInstance.backfillPublicIds();
  await storageInstance.backfillPatientPhones();
}

export default storage;
