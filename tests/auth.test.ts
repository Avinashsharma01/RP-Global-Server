/// <reference types="jest" />

import request from "supertest";
import { app } from "../src/app";
import { describe, it } from "node:test";

describe("Authentication & Authorization API (/api/v1/auth)", () => {
  let adminToken: string;

  it("should fail login with 400 when fields are missing", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should fail login with 401 when invalid credentials are provided", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "wrongadmin@rpglobalprojects.com",
      password: "incorrect_password",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should reject the previously accepted agency demo account", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "admin@agency.com",
      password: "Admin@RPGlobal2026!",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should succeed login with 200 and return JWT for valid admin", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "admin@rpglobalprojects.com",
      password: "Admin@RPGlobal2026!",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe("admin@rpglobalprojects.com");
    adminToken = res.body.token;
  });

  it("should fail /me with 401 when token is missing", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should reject demo bearer tokens", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer demo_token_rpglobal_2026");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should succeed /me with 200 when valid bearer token is provided", async () => {
    if (!adminToken) {
      const loginRes = await request(app).post("/api/v1/auth/login").send({
        email: "admin@rpglobalprojects.com",
        password: "Admin@RPGlobal2026!",
      });
      adminToken = loginRes.body.token;
    }

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe("SUPER_ADMIN");
  });

  it("should accept forgot-password request and dispatch reset token", async () => {
    const res = await request(app).post("/api/v1/auth/forgot-password").send({
      email: "admin@rpglobalprojects.com",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected ${String(actual)} to be ${String(expected)}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error("Expected value to be defined");
      }
    },
  };
}

