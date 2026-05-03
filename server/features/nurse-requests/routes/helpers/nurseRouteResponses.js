export function sendNurseRouteError(res, error, config) {
  const known = config?.known || {};
  if (known[error?.message]) {
    const { status, message } = known[error.message];
    return res.status(status).json({ message });
  }
  console.error(config?.logLabel || "Nurse route error:", error);
  return res.status(500).json({ message: config?.fallbackMessage || "Request failed" });
}

export function withSerializedResponse(res, data, serialize) {
  return res.json(serialize(data));
}
