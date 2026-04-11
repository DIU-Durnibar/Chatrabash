export function parseJwt(token) {
  if (!token) return null;
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export function getRolesFromPayload(payload) {
  if (!payload) return [];
  const r = payload.role ?? payload[ROLE_CLAIM];
  if (Array.isArray(r)) return r;
  if (typeof r === "string" && r) return [r];
  return [];
}

export function getRolesFromStorage() {
  const token = localStorage.getItem("token");
  return getRolesFromPayload(parseJwt(token));
}

export function isManager() {
  return getRolesFromStorage().includes("Manager");
}

export function isBoarder() {
  return getRolesFromStorage().includes("Boarder");
}

export function isSuperAdmin() {
  return getRolesFromStorage().includes("SuperAdmin");
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userEmail");
}
