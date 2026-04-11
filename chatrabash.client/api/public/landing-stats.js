const { backendOrigin, proxyRequest } = require("../lib/proxy-core");

module.exports = async function handler(req, res) {
  const u = new URL(req.url, `http://${req.headers.host}`);
  const target = `${backendOrigin()}/api/public/landing-stats${u.search}`;
  await proxyRequest(req, res, target);
};

module.exports.config = { maxDuration: 10 };
