import request from "supertest";
import { app } from "../src/app";

describe("Product & Plant Solutions API (/api/v1/products)", () => {
  let adminToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: "admin@rpglobalprojects.com",
      password: "AdminSecurePass2026!",
    });
    adminToken = loginRes.body.token;
  });

  it("should fetch public products list with HTTP 200", async () => {
    const res = await request(app).get("/api/v1/products");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should fetch individual product by slug", async () => {
    const res = await request(app).get("/api/v1/products/effluent-treatment-plants");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe("effluent-treatment-plants");
  });

  it("should return 404 for nonexistent product slug", async () => {
    const res = await request(app).get("/api/v1/products/non-existent-solution-9999");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should require admin authorization to create new product", async () => {
    const res = await request(app).post("/api/v1/products").send({
      title: "Test Hydro Cyclone",
      category: "ETP",
    });
    expect(res.status).toBe(401);
  });
});

