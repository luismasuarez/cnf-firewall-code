// middlewares/firewall.js
function createFirewall(config) {
  const { deniedIPs } = config;

  return function firewall(req, res, next) {
    const clientIP = req.ip.replace(/^::ffff:/, "");
    console.log(`[INFO] Solicitud desde IP: ${clientIP}, Ruta: ${req.originalUrl}`);

    if (deniedIPs.includes(clientIP)) {
      console.log(`[DENIED] Bloqueando solicitud de IP: ${clientIP}`);
      req.blocked = true;
      return res.status(403).send("Acceso denegado");
    }

    req.blocked = false;
    next();
  };
}

module.exports = createFirewall;
