import { API_BASE } from "./api";

/** Absolute URL for API-hosted static files (avatars, uploads). */
export function publicUrl(path) {
  if (!path) return `${API_BASE}/default-avatar.svg`;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
