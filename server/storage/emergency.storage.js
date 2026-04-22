import { EmergencyRequest } from "./models.js";
import { buildNewEmergencyRequest, buildPatientRequestQuery, buildPrimaryResponderUpdate, buildRequestLocationUpdate, buildResponderLocationUpdate, buildStatusUpdate } from "./helpers/emergencyStorageHelpers.js";

export const emergencyStorageMethods = {
  async getRequests() {
    return EmergencyRequest.find().sort({ createdAt: -1 });
  },

  async getRequestsByPatient(patientId, options = {}) {
    if (!patientId) return [];
    return EmergencyRequest.find(buildPatientRequestQuery(patientId, options)).sort({ createdAt: -1 });
  },

  async getLatestActiveRequestByPatient(patientId) {
    if (!patientId) return null;
    return EmergencyRequest.findOne(buildPatientRequestQuery(patientId, { onlyActive: true })).sort({ createdAt: -1 });
  },

  async getRequest(id) {
    return EmergencyRequest.findById(id);
  },

  async createRequest(insertRequest, sessionUserId = null) {
    const caseNumber = await this.getNextCaseNumber();
    const patient = sessionUserId ? await this.getUserById(sessionUserId) : null;
    return EmergencyRequest.create(buildNewEmergencyRequest(insertRequest, caseNumber, patient));
  },

  async updateRequestLocation(id, locationData) {
    return EmergencyRequest.findByIdAndUpdate(id, buildRequestLocationUpdate(locationData), { returnDocument: "after", runValidators: true });
  },

  async updateResponderLocation(id, locationData) {
    const request = await EmergencyRequest.findById(id);
    if (!request) return null;
    return EmergencyRequest.findByIdAndUpdate(id, buildResponderLocationUpdate(request, locationData), { returnDocument: "after", runValidators: true });
  },

  async updateRequestStatus(id, status, acceptedBy, acceptedByName) {
    return EmergencyRequest.findByIdAndUpdate(id, buildStatusUpdate(status, acceptedBy, acceptedByName), { returnDocument: "after" });
  },

  async assignPrimaryResponder(id, responderId, responderName, responderRole) {
    return EmergencyRequest.findByIdAndUpdate(id, buildPrimaryResponderUpdate(responderId, responderName, responderRole), { returnDocument: "after" });
  },

  async updateRequest(id, updateData) {
    return EmergencyRequest.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true });
  }
};
