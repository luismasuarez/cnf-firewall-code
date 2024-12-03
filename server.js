// server.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

// Lista de IPs bloqueadas (simula reglas de cortafuegos)
const deniedIPs = ["172.20.0.1"];
console.log(`[INFO] Lista de IPs bloqueadas: ${deniedIPs.join(", ")}`);

// Middleware para simular el cortafuegos
app.use((req, res, next) => {
  const clientIP = req.ip.replace(/^::ffff:/, ""); // IP del cliente
  console.log(
    `[INFO] Solicitud desde IP: ${clientIP}, Ruta: ${req.originalUrl}`
  );

  if (deniedIPs.includes(clientIP)) {
    console.log(`[DENIED] Bloqueando solicitud de IP: ${clientIP}`);
    blockedRequests++; // Incrementa el contador de solicitudes bloqueadas aquí
    return res.status(403).send("Acceso denegado");
  }

  next();
});

// Endpoint principal
app.get("/hello", (req, res) => {
  res.send("Hola, Mundo");
});

// Endpoint de métricas básicas
let allowedRequests = 0;
let blockedRequests = 0;

app.use((req, res, next) => {
  if (res.statusCode !== 403) {
    allowedRequests++; // Si no fue bloqueada, aumenta el contador de solicitudes permitidas
  }
  next();
});

app.get("/metrics", (req, res) => {
  res.json({
    allowedRequests,
    blockedRequests,
    deniedIPs,
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Exporta la app para realizar pruebas con supertest
module.exports = app;