export const DEFAULT_FORM = {
  serviceType: "General Care",
  requestedDate: "",
  requestedTime: "",
  address: "",
  location: "",
  note: "",
  locationLat: "",
  locationLng: "",
};

export function getToday() {
  return new Date().toISOString().slice(0, 10);
}
