import {
  ActivityLog,
  Appointment,
  AppSettings,
  EmergencyRequest,
  NurseRequest,
  User,
  VolunteerRequest,
} from "../../storage/models.js";
import {
  mapAppointment,
  mapEmergencyRequest,
  mapNurseRequest,
  mapUser,
  mapVolunteerRequest,
} from "./mappers.js";
import { toObjectIdString } from "./utils.js";

export async function loadBaseAdminData() {
  const [users, emergencyRequests, nurseRequests, volunteerRequests, appointments, logs, appSettings] = await Promise.all([
    User.find({}).sort({ createdAt: -1 }).lean(),
    EmergencyRequest.find({}).sort({ createdAt: -1 }).lean(),
    NurseRequest.find({}).sort({ createdAt: -1 }).lean(),
    VolunteerRequest.find({}).sort({ createdAt: -1 }).lean(),
    Appointment.find({}).sort({ createdAt: -1 }).lean(),
    ActivityLog.find({}).sort({ createdAt: -1 }).limit(12).lean(),
    AppSettings.findOne({ singletonKey: "default" }).lean(),
  ]);

  return {
    users: users.map(mapUser),
    emergencyRequests: emergencyRequests.map(mapEmergencyRequest),
    nurseRequests: nurseRequests.map(mapNurseRequest),
    volunteerRequests: volunteerRequests.map(mapVolunteerRequest),
    appointments: appointments.map(mapAppointment),
    logs: logs.map((item) => ({
      id: toObjectIdString(item?._id),
      actorId: item?.actorId || "",
      actorName: item?.actorName || "System",
      action: item?.action || "",
      details: item?.details || "",
      createdAt: item?.createdAt || null,
    })),
    appSettings: appSettings || null,
  };
}

export async function getMappedUsers() {
  return (await User.find({}).sort({ createdAt: -1 }).lean()).map(mapUser);
}

export async function getMappedAppointments() {
  return (await Appointment.find({}).sort({ createdAt: -1 }).lean()).map(mapAppointment);
}

export async function getMappedNurseRequests() {
  return (await NurseRequest.find({}).sort({ createdAt: -1 }).lean()).map(mapNurseRequest);
}

export async function getMappedVolunteerRequests() {
  return (await VolunteerRequest.find({}).sort({ createdAt: -1 }).lean()).map(mapVolunteerRequest);
}

export async function getMappedRequestCollections() {
  const [emergencyRequests, nurseRequests, volunteerRequests] = await Promise.all([
    EmergencyRequest.find({}).sort({ createdAt: -1 }).lean(),
    NurseRequest.find({}).sort({ createdAt: -1 }).lean(),
    VolunteerRequest.find({}).sort({ createdAt: -1 }).lean(),
  ]);

  return {
    emergencyRequests: emergencyRequests.map(mapEmergencyRequest),
    nurseRequests: nurseRequests.map(mapNurseRequest),
    volunteerRequests: volunteerRequests.map(mapVolunteerRequest),
  };
}
