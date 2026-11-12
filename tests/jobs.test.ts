import request from "supertest";
import path from "path";
import { app } from "../src/app";

describe("Careers & ATS Recruitment API (/api/v1/jobs)", () => {
  let adminToken: string;
  let activeJobId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: "admin@rpglobalprojects.com",
      password: "AdminSecurePass2026!",
    });
    adminToken = loginRes.body.token;
  });

  it("should fetch active public job openings", async () => {
    const res = await request(app).get("/api/v1/jobs");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      activeJobId = res.body.data[0]._id;
    }
  });

  it("should submit a job application with PDF resume attachment", async () => {
    if (!activeJobId) return;

    const samplePdfPath = path.resolve(
      __dirname,
      "../../client/public/downloads/rpglobal-etp-plants-spec.pdf"
    );

    const res = await request(app)
      .post(`/api/v1/jobs/${activeJobId}/apply`)
      .field("fullName", "Rohan Kulkarni")
      .field("email", "rohan.kulkarni@example.com")
      .field("phone", "+91 97654 32109")
      .field("experienceYears", "5 Years")
      .field("currentCompany", "Thermax Ltd")
      .field("expectedCtc", "12 LPA")
      .field("noticePeriodDays", "30")
      .attach("resume", samplePdfPath);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.fullName).toBe("Rohan Kulkarni");
  });

  it("should return applications list to authenticated HR admin", async () => {
    const res = await request(app)
      .get("/api/v1/jobs/admin/applications")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
