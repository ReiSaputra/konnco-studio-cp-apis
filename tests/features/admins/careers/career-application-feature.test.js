import { afterEach, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import app from "../../../../src/app.js";
import { prisma } from "../../../../src/database.js";
import bcrypt from "bcrypt";

describe("when admin want to get career applications data in route GET /api/v1/admins/careers/applications", () => {
  let adminId1;
  let adminId2;

  beforeAll(async () => {
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  let careerId1 = null;
  let careerId2 = null;

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);
    adminId1 = await prisma.admin.create({
      data: {
        email: "konnco@konnco.com",
        password: hash,
        name: "Admin Konnco",
        phoneNumber: "087823322523",
        role: "ADMIN",
        permissions: {
          create: {
            canShowApplication: true,
            canViewApplication: true,
            canDeleteApplication: true,
          },
        },
      },
      select: {
        id: true,
      },
    });

    adminId2 = await prisma.admin.create({
      data: {
        email: "konnco2@konnco.com",
        password: hash,
        name: "Admin Konnco",
        phoneNumber: "087823322524",
        role: "ADMIN",
        permissions: {
          create: {
            canShowApplication: true,
            canViewApplication: true,
            canDeleteApplication: true,
          },
        },
      },
      select: {
        id: true,
      },
    });

    for (let index = 1; index <= 30; index++) {
      if (index % 2 === 0) {
        careerId1 = await prisma.career.create({
          data: {
            title: `Software Developer - ${index}`,
            description: `Description ${index}`,
            requirements: `Requirements ${index}`,
            salary: "Rp. 1.000.000",
            type: "WEB",
            tags: "Tag A, Tag B, Tag C",
            authorId: adminId1.id,
          },
          select: {
            id: true,
          },
        });
      } else {
        careerId2 = await prisma.career.create({
          data: {
            title: `Accounting - ${index}`,
            description: `Description ${index}`,
            requirements: `Requirements ${index}`,
            salary: "Rp. 1.000.000",
            type: "ACCOUNTING",
            tags: "Tag A, Tag B, Tag C",
            authorId: adminId2.id,
          },
          select: {
            id: true,
          },
        });
      }
    }

    for (let index = 1; index <= 30; index++) {
      if (index % 2 === 0) {
        await prisma.application.create({
          data: {
            applicantName: "Kintaro",
            educationType: "S1",
            instituteName: "Institut Teknologi Sepuluh Nopember",
            phoneNumber: "087823322523",
            skills: "Skill A, Skill B, Skill C",
            email: `kintaro@gmail.com`,
            file: "FORMULIR PERMOHONAN EMAIL.docx",
            letter: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
            careerId: careerId1.id,
          },
        });
      } else {
        await prisma.application.create({
          data: {
            applicantName: "Jojo",
            educationType: "D4",
            email: `jojo@gmail.com`,
            instituteName: "MIT",
            phoneNumber: "087824322523",
            file: "FORMULIR PERMOHONAN EMAIL.docx",
            letter: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
            careerId: careerId2.id,
            skills: "Skill A, Skill B, Skill C",
          },
        });
      }
    }
  });

  afterEach(async () => {
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should be able to get career applications data successfully", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(10);
  });

  it("should be able to get career application but did not find any data", async () => {
    await prisma.application.deleteMany();

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
  });

  it("should not be able to get career applications data - authorization not provided", async () => {
    const response = await supertest(app).get("/api/v1/admins/careers/applications");

    expect(response.status).toBe(401);
    expect(response.body.message).toContain("TokenError:");
  });

  it("should not be able to get career applications data - no permissions", async () => {
    await prisma.adminPermission.update({
      where: {
        adminId: adminId2.id,
      },
      data: {
        canShowApplication: false,
      },
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco2@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: You don't have permission to show admin career applications");
  });

  it("should be able to get career applications data - page 2", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications?page=2").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(5);
  });

  it("should be able to get career applications data - page 3", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications?page=3").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
  });

  it("should be able to get career applications data - no permission", async () => {
    await prisma.adminPermission.update({
      where: {
        adminId: adminId1.id,
      },
      data: {
        canShowApplication: false,
      },
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications?page=3").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: You don't have permission to show admin career applications");
  });

  it("should not be able to get career applications data - page is string", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications?page=invalid-page").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError");
  });

  it("should not be able to get career applications data - page is negative", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications?page=-1").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError");
  });

  it("should be able to get career applications data - search by applicant name", async () => {
    await prisma.application.createMany({
      data: [
        {
          applicantName: "John Doe",
          email: "konnco@konnco.com",
          phoneNumber: "1234567890",
          educationType: "S1",
          instituteName: "Birminham University",
          file: "https://example.com/file.pdf",
          letter: "https://example.com/letter.pdf",
          skills: "Skill A, Skill B, Skill C",
          careerId: careerId1.id,
        },
        {
          applicantName: "Jane Doe",
          email: "konnco@konnco.com",
          phoneNumber: "1234567890",
          educationType: "S1",
          instituteName: "Birminham University",
          file: "https://example.com/file.pdf",
          letter: "https://example.com/letter.pdf",
          skills: "Skill A, Skill B, Skill C",
          careerId: careerId2.id,
        },
      ],
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications?search=John").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].applicantName).toBe("John Doe");

    const loginResponse2 = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco2@konnco.com",
      password: "dontknowityet",
    });

    const response2 = await supertest(app).get("/api/v1/admins/careers/applications?search=Jane").set("Authorization", `Bearer ${loginResponse2.body.data.token}`);

    expect(response2.status).toBe(200);
    expect(response2.body.data).toHaveLength(1);
    expect(response2.body.data[0].applicantName).toBe("Jane Doe");
  });

  it("should be able to get career applications data - search by number but did not find any data", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications?search=0").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully get admin career applications");
  });

  it("should be able to get career applications data - another query param but did not affect anything", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications?another=query").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully get admin career applications");
  });

  it("should be able to get career applications data - search by startDate and endDate", async () => {
    const johnCreatedAt = new Date("2025-05-01T10:00:00.000Z");
    const janeCreatedAt = new Date("2025-06-15T15:30:00.000Z");
    const mamatCreatedAt = new Date("2025-07-01T08:45:00.000Z");

    await prisma.application.createMany({
      data: [
        {
          applicantName: "John Doe",
          email: "konnco@konnco.com",
          phoneNumber: "1234567890",
          educationType: "S1",
          instituteName: "Birminham University",
          file: "https://example.com/file.pdf",
          letter: "https://example.com/letter.pdf",
          skills: "Skill A, Skill B, Skill C",
          careerId: careerId1.id,
          createdAt: johnCreatedAt,
        },
        {
          applicantName: "Mamat Doe",
          email: "konnco@konnco.com",
          phoneNumber: "1234567890",
          educationType: "S1",
          instituteName: "Birminham University",
          file: "https://example.com/file.pdf",
          letter: "https://example.com/letter.pdf",
          skills: "Skill A, Skill B, Skill C",
          careerId: careerId1.id,
          createdAt: mamatCreatedAt,
        },
        {
          applicantName: "Jane Doe",
          email: "konnco@konnco.com",
          phoneNumber: "1234567890",
          educationType: "S1",
          instituteName: "Birminham University",
          file: "https://example.com/file.pdf",
          letter: "https://example.com/letter.pdf",
          skills: "Skill A, Skill B, Skill C",
          careerId: careerId2.id,
          createdAt: janeCreatedAt,
        },
      ],
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get(`/api/v1/admins/careers/applications?startDate=2025-04-01&endDate=2025-07-01`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });

  it("should not be able to get career applications data - invalid startDate", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications?startDate=invalid-date").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError:");
  });

  it("should not be able to get career applications data - invalid endDate", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications?endDate=invalid-date").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError:");
  });

  it("should be able to get career applications data but not filtered - only startDate", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers/applications?startDate=2025-04-01").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(10);
  });


});
