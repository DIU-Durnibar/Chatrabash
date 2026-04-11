const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5091";

export const API_BASE = rawBase.replace(/\/$/, "");

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  let body = options.body;
  if (body != null && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const res = await fetch(apiUrl(path), { ...options, headers, body });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

export async function apiGet(path) {
  return apiFetch(path, { method: "GET" });
}

export async function apiPost(path, body) {
  return apiFetch(path, { method: "POST", body });
}

export async function apiPut(path, body) {
  return apiFetch(path, { method: "PUT", body });
}

export async function apiPatch(path, body) {
  return apiFetch(path, { method: "PATCH", body });
}

export async function apiDelete(path) {
  return apiFetch(path, { method: "DELETE" });
}
