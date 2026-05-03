export function buildPatientRequestQuery(patientId, options = {}) {
  const query = { patientId };
  if (options.onlyActive) query.status = { $nin: ["resolved", "cancelled"] };
  return query;
}

export function buildNewEmergencyRequest(insertRequest, caseNumber, patient = null) {
  return {
    ...insertRequest,
    patientId: patient?._id || null,
    patientPhone: patient?.phone || null,
    age: insertRequest.age ?? 0,
    emergencyType: insertRequest.emergencyType || "Emergency Help",
    urgency: insertRequest.urgency || "High",
    description: insertRequest.description || null,
    caseNumber,
    publicCaseId: `CASE-${caseNumber}`,
  };
}

export function buildRequestLocationUpdate(locationData) {
  const updateData = { locationUpdatedAt: new Date() };
  if (locationData.location !== undefined) updateData.location = locationData.location;
  if (locationData.latitude !== undefined) updateData.latitude = locationData.latitude;
  if (locationData.longitude !== undefined) updateData.longitude = locationData.longitude;
  return updateData;
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

export function calculateRouteStartDistanceKm(request, locationData) {
  if (request.status !== "on_the_way" || request.routeStartDistanceKm != null || request.latitude == null || request.longitude == null) {
    return null;
  }

  const earthRadiusKm = 6371;
  const dLat = toRad(request.latitude - locationData.latitude);
  const dLng = toRad(request.longitude - locationData.longitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(locationData.latitude)) * Math.cos(toRad(request.latitude)) * Math.sin(dLng / 2) ** 2;
  return Math.max(2 * earthRadiusKm * Math.asin(Math.sqrt(a)), 0.1);
}

export function buildResponderLocationUpdate(request, locationData) {
  const updateData = {
    responderLocationUpdatedAt: new Date(),
    responderLatitude: locationData.latitude,
    responderLongitude: locationData.longitude,
  };

  const routeStartDistanceKm = calculateRouteStartDistanceKm(request, locationData);
  if (routeStartDistanceKm != null) updateData.routeStartDistanceKm = routeStartDistanceKm;
  return updateData;
}

export function buildStatusUpdate(status, acceptedBy, acceptedByName) {
  const updateData = { status };
  if (["accepted", "resolved", "cancelled"].includes(status)) {
    Object.assign(updateData, {
      routeStartedAt: null,
      routeStartDistanceKm: null,
      responderLatitude: null,
      responderLongitude: null,
      responderLocationUpdatedAt: null,
    });
  }
  if (status === "on_the_way") {
    updateData.routeStartedAt = new Date();
    updateData.routeStartDistanceKm = null;
  }
  if (status === "arrived") updateData.routeStartDistanceKm = 0;
  if (acceptedBy !== undefined) updateData.acceptedBy = acceptedBy;
  if (acceptedByName !== undefined) updateData.acceptedByName = acceptedByName;
  return updateData;
}

export function buildPrimaryResponderUpdate(responderId, responderName, responderRole) {
  return {
    primaryResponderId: responderId,
    primaryResponderName: responderName,
    primaryResponderRole: responderRole,
    acceptedBy: responderId,
    acceptedByName: responderName,
    responderLatitude: null,
    responderLongitude: null,
    responderLocationUpdatedAt: null,
    routeStartedAt: null,
    routeStartDistanceKm: null,
    status: "accepted",
  };
}
