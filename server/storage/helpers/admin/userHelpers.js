export function buildUserSections(users) {
  return users.reduce((sections, user) => {
    if (user.role === "patient") sections.patients.push(user);
    else if (user.role === "doctor") sections.doctors.push(user);
    else if (user.role === "nurse") sections.nurses.push(user);
    else sections.others.push(user);
    return sections;
  }, { patients: [], doctors: [], nurses: [], others: [] });
}

export function buildAllowedAdminUserUpdate(data = {}) {
  const allowed = {};
  if (typeof data.name === "string") allowed.name = data.name.trim();
  if (typeof data.email === "string") allowed.email = data.email.trim().toLowerCase();
  if (typeof data.phone === "string") allowed.phone = data.phone.trim();
  if (typeof data.role === "string") allowed.role = data.role;
  if (typeof data.active === "boolean") allowed.active = data.active;
  return allowed;
}
