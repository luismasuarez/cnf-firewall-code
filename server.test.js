// server.test.js
const request = require("supertest");
const express = require("express");

const app = require("./server");  // Asegúrate de que exportas tu app en server.js

describe("Pruebas de servidor Express", () => {

  it("debería devolver 'Hola, Mundo' en el endpoint /hello", async () => {
    const res = await request(app).get("/hello");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hola, Mundo");
  });

  it("debería bloquear la IP en la lista negra (deniedIPs)", async () => {
    const res = await request(app)
      .get("/hello")
      .set("X-Real-IP", "172.20.0.1"); // Simula una IP bloqueada
    expect(res.status).toBe(403);
    expect(res.text).toBe("Acceso denegado");
  });

  it("debería permitir solicitudes de IPs no bloqueadas", async () => {
    const res = await request(app)
      .get("/hello")
      .set("X-Real-IP", "192.168.1.100"); // IP no bloqueada
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hola, Mundo");
  });

  it("debería devolver métricas correctamente", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("allowedRequests");
    expect(res.body).toHaveProperty("blockedRequests");
    expect(res.body).toHaveProperty("deniedIPs");
    expect(Array.isArray(res.body.deniedIPs)).toBe(true);
  });

});
