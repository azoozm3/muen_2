import {
  ActivityLog,
  Appointment,
  Counter,
  EmergencyRequest,
  PatientInteractionRating,
  Review,
  User,
} from "./models.js";

export const sequenceStorageMethods = {
  async getNextSequence(name, start = 1000) {
    let counter = await Counter.findOneAndUpdate(
      { name },
      { $inc: { seq: 1 } },
      {
        returnDocument: "after",
        upsert: false,
      },
    );

    if (!counter) {
      try {
        counter = await Counter.create({
          name,
          seq: start,
        });
      } catch (error) {
        counter = await Counter.findOneAndUpdate(
          { name },
          { $inc: { seq: 1 } },
          {
            returnDocument: "after",
            upsert: false,
          },
        );
      }
    }

    return counter.seq;
  },

  async getNextCaseNumber() {
    return await this.getNextSequence("emergencyRequest", 1);
  },

  async getNextUserNumber() {
    return await this.getNextSequence("user", 1);
  },

  async backfillPublicIds() {
    await Counter.findOneAndUpdate(
      { name: "user" },
      { $setOnInsert: { name: "user", seq: 1000 } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    const users = await User.find({
      $or: [
        { userNumber: { $exists: false } },
        { userNumber: null },
        { publicUserId: { $exists: false } },
        { publicUserId: null },
      ],
    }).sort({ createdAt: 1 });

    for (const user of users) {
      const nextUserNumber = await this.getNextUserNumber();
      user.userNumber = nextUserNumber;
      user.publicUserId = `USR-${nextUserNumber}`;
      await user.save();
    }

    await Counter.findOneAndUpdate(
      { name: "emergencyRequest" },
      { $setOnInsert: { name: "emergencyRequest", seq: 5000 } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    const requests = await EmergencyRequest.find({
      $or: [
        { caseNumber: { $exists: false } },
        { caseNumber: null },
        { publicCaseId: { $exists: false } },
        { publicCaseId: null },
      ],
    }).sort({ createdAt: 1 });

    for (const request of requests) {
      const nextCaseNumber = await this.getNextCaseNumber();
      request.caseNumber = nextCaseNumber;
      request.publicCaseId = `CASE-${nextCaseNumber}`;
      await request.save();
    }
  }
};
