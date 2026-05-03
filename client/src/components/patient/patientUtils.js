export function formatCoordinateLocation(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return "";
  }

  return `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

export function getRequestStatusTitle(status) {
  return (
    {
      pending: "Searching for Help...",
      accepted: "Responder Assigned",
      on_the_way: "Help is on the Way!",
      arrived: "Responder Has Arrived",
      resolved: "Emergency Resolved",
      cancelled: "Emergency Cancelled",
    }[status] || "Emergency Request"
  );
}

export function getRequestStatusMessage(status) {
  return (
    {
      pending: "We have alerted nearby medical professionals. Please stay on this screen.",
      accepted: "A medical professional has accepted your request and is preparing to come.",
      on_the_way: "Your responder is traveling to your location now.",
      arrived: "Your responder has arrived. Medical assistance is being provided.",
      resolved: "This emergency has been marked as resolved. Take care.",
      cancelled: "This emergency request was cancelled. You can return to the dashboard or create a new one if needed.",
    }[status] || "Please stay on this screen."
  );
}
