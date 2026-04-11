/** Production API host (SmarterASP / your deployed backend). No Vercel proxy — those caused repeated 502s. */
const PRODUCTION_API_DEFAULT = "https://hasibhasnain-001-site1.ktempurl.com";

function resolveApiBase() {
  const raw = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
  if (raw === "same-origin" || raw === "." || raw === "") {
    if (import.meta.env.DEV) return "http://localhost:5091".replace(/\/$/, "");
    return PRODUCTION_API_DEFAULT;
  }
  return raw;
}

export const API_BASE = resolveApiBase();

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
  const ct = res.headers.get("content-type") || "";
  if (res.ok && ct.includes("text/html")) {
    console.warn("[api] Got HTML instead of JSON:", path);
    return {
      ok: false,
      status: res.status,
      json: { success: false, message: "API returned HTML (wrong URL or server error page)." },
    };
  }
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
