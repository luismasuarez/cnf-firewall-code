const request = require("supertest");
const app = require("./server");

describe("Pruebas de servidor Express", () => {
  beforeAll(() => {
    app.set("trust proxy", true);
  });

  it("debería devolver 'Hola, Mundo' en el endpoint /hello", async () => {
    const res = await request(app).get("/hello");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hola, Mundo");
  });

  it("debería bloquear la IP en la lista negra (deniedIPs)", async () => {
    const res = await request(app)
      .get("/hello")
      .set("X-Forwarded-For", "172.20.0.1"); // Simula una IP bloqueada
    expect(res.status).toBe(403);
    expect(res.text).toBe("Acceso denegado");
  });

  it("debería permitir solicitudes de IPs no bloqueadas", async () => {
    const res = await request(app).get("/hello");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hola, Mundo");
  });

  it("debería devolver métricas correctamente", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        allowedRequests: expect.any(Number),
        blockedRequests: expect.any(Number),
        deniedIPs: expect.arrayContaining(["172.20.0.1"]),
      })
    );
  });
});
