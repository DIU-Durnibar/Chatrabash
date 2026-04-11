/**
 * Vercel Edge Middleware — proxies to ASP.NET backend.
 * Replaces fragile /api/[...slug] serverless routing (nested paths like /api/public/* often 404'd).
 */
const DEFAULT_BACKEND = "https://hasibhasnain-001-site1.ktempurl.com";

function backendOrigin() {
  return (process.env.BACKEND_ORIGIN || DEFAULT_BACKEND).replace(/\/$/, "");
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const p = url.pathname;
  const search = url.search;

  let target;
  if (p.startsWith("/api/uploads-proxy/")) {
    const rest = p.slice("/api/uploads-proxy/".length);
    target = `${backendOrigin()}/uploads/${rest}${search}`;
  } else if (p === "/api/avatar-proxy") {
    target = `${backendOrigin()}/default-avatar.svg${search}`;
  } else if (p.startsWith("/api/")) {
    target = `${backendOrigin()}${p}${search}`;
  } else if (p.startsWith("/uploads/")) {
    target = `${backendOrigin()}${p}${search}`;
  } else if (p === "/default-avatar.svg") {
    target = `${backendOrigin()}/default-avatar.svg${search}`;
  } else {
    return;
  }

  const headers = new Headers(request.headers);
  headers.delete("host");

  /** @type {RequestInit} */
  const init = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  try {
    return await fetch(target, init);
  } catch (e) {
    return new Response(JSON.stringify({ error: "proxy_fetch_failed", message: String(e?.message || e) }), {
      status: 502,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
}

export const config = {
  matcher: ["/api/:path*", "/uploads/:path*", "/default-avatar.svg"],
};
