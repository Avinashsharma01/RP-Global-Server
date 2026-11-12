import request from "supertest";
import path from "path";
import { app } from "../src/app";

describe("RFQ & Leads CRM API (/api/v1/rfq)", () => {
  let adminToken: string;
  let createdLeadId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: "admin@rpglobalprojects.com",
      password: "AdminSecurePass2026!",
    });
    adminToken = loginRes.body.token;
  });

  it("should fail RFQ submission with 400 when required fields are missing", async () => {
    const res = await request(app).post("/api/v1/rfq").send({
      fullName: "Incomplete Lead",
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should create a new RFQ lead successfully with JSON body", async () => {
    const res = await request(app).post("/api/v1/rfq").send({
      fullName: "Vikram Singhania",
      companyName: "Singhania Agro Industries Ltd",
      email: "vikram.singhania@singhania-agro.example.com",
      phone: "+91 98200 12345",
      plantCategory: "Effluent Treatment Plant (ETP)",
      requiredCapacityKLD: "1200 KLD",
      projectLocation: "Ahmedabad, Gujarat",
      message: "Need urgent ZLD and tertiary filtration upgrade.",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.fullName).toBe("Vikram Singhania");
    createdLeadId = res.body.data._id;
  });

  it("should accept multipart RFQ submission with attached water test report", async () => {
    const samplePdfPath = path.resolve(
      __dirname,
      "../../client/public/downloads/rpglobal-etp-plants-spec.pdf"
    );

    const res = await request(app)
      .post("/api/v1/rfq")
      .field("fullName", "Ananya Deshmukh")
      .field("companyName", "Deshmukh Pharmaceuticals")
      .field("email", "ananya@deshmukh-pharma.example.com")
      .field("phone", "+91 98450 67890")
      .field("plantCategory", "Zero Liquid Discharge (ZLD)")
      .field("requiredCapacityKLD", "500 KLD")
      .attach("waterReport", samplePdfPath);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.attachedReportUrl).toBeDefined();
  });

  it("should reject unauthorized requests to get leads without token", async () => {
    const res = await request(app).get("/api/v1/rfq");
    expect(res.status).toBe(401);
  });

  it("should return leads list when authenticated as admin", async () => {
    const res = await request(app)
      .get("/api/v1/rfq")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should update lead status in CRM pipeline", async () => {
    if (!createdLeadId) return;

    const res = await request(app)
      .patch(`/api/v1/rfq/${createdLeadId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "TECHNICAL_EVALUATION" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("TECHNICAL_EVALUATION");
  });
});
