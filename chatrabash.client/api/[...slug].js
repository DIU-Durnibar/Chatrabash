/**
 * Catch-all for /api/* not covered by api/public/*.js (login, manager, etc.)
 */
const { backendOrigin, proxyRequest } = require("./lib/proxy-core");

function buildTarget(pathname, search) {
  if (pathname === "/api/avatar-proxy") {
    return `${backendOrigin()}/default-avatar.svg${search}`;
  }
  if (pathname.startsWith("/api/uploads-proxy/")) {
    const rest = pathname.slice("/api/uploads-proxy/".length);
    return `${backendOrigin()}/uploads/${rest}${search}`;
  }
  if (pathname.startsWith("/api/")) {
    return `${backendOrigin()}${pathname}${search}`;
  }
  return null;
}

module.exports = async function handler(req, res) {
  const u = new URL(req.url, `http://${req.headers.host}`);
  const target = buildTarget(u.pathname, u.search);

  if (!target) {
    res.status(404).json({ error: "not_found", path: u.pathname });
    return;
  }

  await proxyRequest(req, res, target);
};

module.exports.config = { maxDuration: 10 };
