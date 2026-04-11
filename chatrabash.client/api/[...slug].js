/**
 * Vercel Node.js proxy → ASP.NET backend.
 * Parent repo has "type":"module"; this folder uses CommonJS so Vercel bundles the function reliably.
 */
const DEFAULT_BACKEND = "https://hasibhasnain-001-site1.ktempurl.com";

function backendOrigin() {
  return (process.env.BACKEND_ORIGIN || DEFAULT_BACKEND).replace(/\/$/, "");
}

async function readBody(req) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return undefined;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return undefined;
  return Buffer.concat(chunks);
}

module.exports = async function handler(req, res) {
  const u = new URL(req.url, `http://${req.headers.host}`);
  const pathname = u.pathname;
  const search = u.search;

  let target;
  if (pathname === "/api/avatar-proxy") {
    target = `${backendOrigin()}/default-avatar.svg${search}`;
  } else if (pathname.startsWith("/api/uploads-proxy/")) {
    const rest = pathname.slice("/api/uploads-proxy/".length);
    target = `${backendOrigin()}/uploads/${rest}${search}`;
  } else if (pathname.startsWith("/api/")) {
    target = `${backendOrigin()}${pathname}${search}`;
  } else {
    res.status(404).end();
    return;
  }

  const headers = new Headers();
  const skip = new Set(["host", "connection", "content-length", "transfer-encoding"]);
  for (const [k, v] of Object.entries(req.headers)) {
    if (skip.has(k.toLowerCase())) continue;
    if (v == null) continue;
    headers.set(k, Array.isArray(v) ? v[0] : v);
  }

  const init = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  const body = await readBody(req);
  if (body) init.body = body;

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).end();
    return;
  }

  try {
    const r = await fetch(target, init);
    res.status(r.status);
    const hopByHop = new Set(["connection", "transfer-encoding", "keep-alive"]);
    r.headers.forEach((value, key) => {
      if (hopByHop.has(key.toLowerCase())) return;
      res.setHeader(key, value);
    });
    const buf = Buffer.from(await r.arrayBuffer());
    res.send(buf);
  } catch (e) {
    console.error("[api proxy]", target, e);
    res.status(502).json({ error: "bad_gateway", message: String(e?.message || e), target });
  }
};

module.exports.config = {
  maxDuration: 10,
};
