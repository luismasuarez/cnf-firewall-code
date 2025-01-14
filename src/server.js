// server.js
const express = require("express");
const app = express();
const firewall = require("./middlewares/firewall");
const metrics = require("./middlewares/metrics");
const deniedIPs = require('./data/deniedIPs')
console.log("Hola desde el server.js)
const PORT = process.env.PORT || 5000;

const firewallConfig = {
  deniedIPs: deniedIPs,
};

// Middlewares
app.use(firewall(firewallConfig));
app.use(metrics.collect);

// Endpoints
app.get("/hello", (req, res) => {
  res.send("Hola, Mundo");
});

app.get("/metrics", metrics.report);

// Inicia el servidor solo si no está en pruebas
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

// Exporta la app para realizar pruebas
module.exports = app;
