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

function buildUpstreamHeaders(req) {
  const out = new Headers();
  const pass = [
    "authorization",
    "content-type",
    "accept",
    "accept-language",
    "accept-encoding",
    "cookie",
    "x-requested-with",
  ];
  for (const name of pass) {
    const v = req.headers[name];
    if (v) out.set(name, Array.isArray(v) ? v[0] : v);
  }
  return out;
}

async function proxyRequest(req, res, target) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).end();
    return;
  }

  const headers = buildUpstreamHeaders(req);
  const init = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  const body = await readBody(req);
  if (body) init.body = body;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  init.signal = ctrl.signal;

  try {
    const r = await fetch(target, init);
    clearTimeout(timer);
    res.status(r.status);
    const skip = new Set(["connection", "transfer-encoding", "keep-alive"]);
    r.headers.forEach((value, key) => {
      if (skip.has(key.toLowerCase())) return;
      res.setHeader(key, value);
    });
    const buf = Buffer.from(await r.arrayBuffer());
    res.send(buf);
  } catch (e) {
    clearTimeout(timer);
    console.error("[proxy]", target, e);
    res.status(502).json({
      error: "bad_gateway",
      message: String(e?.message || e),
      target,
    });
  }
}

module.exports = {
  backendOrigin,
  proxyRequest,
};
