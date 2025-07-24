import { afterAll, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import path from "path";
import fs from "fs";

import { prisma } from "../../src/database.js";

import app from "../../src/app.js";

beforeAll(async () => {
  await prisma.application.deleteMany();
  await prisma.career.deleteMany();
  await prisma.adminPermission.deleteMany();
  await prisma.admin.deleteMany();
});

describe("when users create wants to apply for a job application", () => {
  let careerId;

  beforeAll(async () => {
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    careerId = await prisma.career.create({
      data: {
        title: "Software Developer (React)",
        description: "Description A",
        tags: "Tag A, Tag B, Tag C",
        type: "WEB",
        glintsInfo: "https://glints.com",
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        author: {
          create: {
            name: "Admin A",
            email: "adminA@konnco.com",
            password: "dontknowityet",
            phoneNumber: "087843202523",
            role: "ADMIN",
            permissions: {
              create: {},
            },
          },
        },
        salary: "Rp. 1.000.000",
      },
      select: {
        id: true,
      },
    });
  });

  afterEach(async () => {
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should be able to create a job application successfully", async () => {
    const filePath = path.resolve(__dirname, "../samples/files/[2] PRD - Konnco Studio Company Profile.pdf");

    const response = await supertest(app)
      .post(`/api/v1/careers/${careerId.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("companyName", "PT. Konnco")
      .field("position", "Software Developer")
      .field("lengthOfService", "BELOW_1_YEAR")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "React")
      .field("skills", "Vue")
      .field("skills", "Angular")
      .attach("cv", filePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully created career application",
      data: {
        id: expect.any(String),
      },
    });
  });

  it("should be able to create a job application - same job, different applicant", async () => {
    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${careerId.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("companyName", "PT. Konnco")
      .field("position", "Software Developer")
      .field("lengthOfService", "ABOVE_1_YEAR")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .field("skills", "CSS")
      .attach("cv", filePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully created career application",
      data: {
        id: expect.any(String),
      },
    });
  });

  it("should not be able to create a job application - invalid data (invalid params)", async () => {
    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/no-career-id/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("companyName", "PT. ASYX")
      .field("position", "Software Developer")
      .field("lengthOfService", 10)
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .field("skills", "CSS")
      .attach("cv", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError");
  });

  it("should be able to create a job application - (no field 'industry')", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .field("skills", "CSS")
      .attach("cv", filePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully created career application",
      data: {
        id: expect.any(String),
      },
    });
  });

  it("should be able to create a job application - no field all, only files", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app).post(`/api/v1/careers/${findCareer.id}/applications`).attach("cv", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Applicant's Name is required");
  });

  it("should be able to create a job application - (no field 'email')", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .field("skills", "CSS")
      .attach("cv", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Email is required");
  });

  it("should be able to create a job application - (no field 'phone number')", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@gmail.com")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .field("skills", "CSS")
      .attach("cv", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Phone Number is required");
  });

  it("should be able to create a job application - (no field 'education level')", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@gmail.com")
      .field("phoneNumber", "087843202123")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .field("skills", "CSS")
      .attach("cv", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Education Level is required");
  });

  it("should be able to create a job application - (no field 'instituteName')", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@gmail.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .field("skills", "CSS")
      .attach("cv", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Institute Name is required");
  });

  it("should be able to create a job application - (no field 'skills')", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@gmail.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .attach("cv", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Skills is required");
  });

  it("should be able to create a job application - (no field 'message')", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@gmail.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("skills", "HTML")
      .attach("cv", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Message is required");
  });

  it("should not be able to create a job application - invalid data (undefined files)", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("companyName", "PT. ASYX")
      .field("position", "Software Developer")
      .field("lengthOfService", 10)
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .field("skills", "CSS");

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Either File");
  });

  it("should be able to create a job application - send 1 skill", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("companyName", "PT. ASYX")
      .field("position", "Software Developer")
      .field("lengthOfService", "ABOVE_1_YEAR")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .attach("cv", filePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully created career application",
      data: {
        id: expect.any(String),
      },
    });
  });

  it("should be able to create a job application - all fields without companyName", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("position", "Software Developer")
      .field("lengthOfService", "ABOVE_1_YEAR")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .attach("cv", filePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully created career application",
      data: {
        id: expect.any(String),
      },
    });
  });

  it("should be able to create a job application - all fields without position", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("companyName", "PT. ASYX")
      .field("lengthOfService", "ABOVE_1_YEAR")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .attach("cv", filePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully created career application",
      data: {
        id: expect.any(String),
      },
    });
  });

  it("should be able to create a job application - all fields without lengthOfService", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("companyName", "PT. ASYX")
      .field("position", "Software Developer")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .attach("cv", filePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully created career application",
      data: {
        id: expect.any(String),
      },
    });
  });

  it("should not be able to create a job application - file is not pdf", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/FORMULIR PERMOHONAN EMAIL.docx");
    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("companyName", "PT. Konnco")
      .field("position", "Software Developer")
      .field("lengthOfService", "ABOVE_1_YEAR")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .attach("cv", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Either File");
  });

  it("should not be able to create a job application - file is too large", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/PPTIK - Muhammad Fathurraihan Saputra.pdf");

    const response = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("companyName", "PT. Konnco")
      .field("position", "Software Developer")
      .field("lengthOfService", "ABOVE_1_YEAR")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "HTML")
      .attach("cv", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("MulterError");
  });
});

describe("when users create wants to apply for a job application", () => {
  let careerId;

  beforeAll(async () => {
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    careerId = await prisma.career.create({
      data: {
        title: "Software Developer (React)",
        description: "Description A",
        tags: "Tag A, Tag B, Tag C",
        type: "WEB",
        glintsInfo: "https://glints.com",
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        author: {
          create: {
            name: "Admin A",
            email: "adminA@konnco.com",
            password: "dontknowityet",
            phoneNumber: "087843202523",
            role: "ADMIN",
            permissions: {
              create: {},
            },
          },
        },
        salary: "Rp. 1.000.000",
      },
      select: {
        id: true,
      },
    });
  });

  afterEach(async () => {
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should be able to create and get the response 'thank you' from the career application page successfully", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const filePath = path.resolve(__dirname, "../samples/files/[2] PRD - Konnco Studio Company Profile.pdf");

    const responseOne = await supertest(app)
      .post(`/api/v1/careers/${findCareer.id}/applications`)
      .field("applicantName", "Fathurraihan Saputra")
      .field("email", "nemesis@konnco.com")
      .field("phoneNumber", "087843202123")
      .field("educationLevel", "SMA")
      .field("instituteName", "SMAN 1 Cianjur")
      .field("companyName", "PT. Konnco")
      .field("position", "Software Developer")
      .field("lengthOfService", "BELOW_1_YEAR")
      .field("message", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.")
      .field("skills", "React")
      .field("skills", "Vue")
      .field("skills", "Angular")
      .attach("cv", filePath);

    const responseTwo = await supertest(app).get(`/api/v1/careers/${findCareer.id}/applications/${responseOne.body.data.id}/thank-you`);

    expect(responseTwo.status).toBe(200);
    expect(responseTwo.body).toEqual({
      message: "Successfully get response thanks application",
      data: {
        applicantName: "Fathurraihan Saputra",
      },
    });
  });

  it("should not be able to get the response 'thank you' from the career application page - careerId is wrong", async () => {
    const findCareer = await prisma.career.findUnique({
      where: {
        id: careerId.id,
      },
      select: {
        id: true,
      },
    });

    const response = await supertest(app).get(`/api/v1/careers/${findCareer.id}/applications/there-is-no-id/thank-you`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Error: Application not found",
    });
  });
});

afterAll(async () => {
  await prisma.application.deleteMany();
  await prisma.career.deleteMany();
  await prisma.adminPermission.deleteMany();
  await prisma.admin.deleteMany();

const folderPath = "assets/files/cv"

  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
});
