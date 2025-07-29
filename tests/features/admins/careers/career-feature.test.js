import { afterEach, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import { prisma } from "../../../../src/database.js";
import bcrypt from "bcrypt";
import app from "../../../../src/app.js";
import supertest from "supertest";

describe("when admin want to create careers data in route POST /api/v1/admins/careers", () => {
  let adminId;

  beforeAll(async () => {
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);

    adminId = await prisma.admin.create({
      data: {
        email: "adminKonnco@konnco.com",
        password: hash,
        name: "Admin Konnco",
        phoneNumber: "087823322523",
        role: "ADMIN",
        permissions: {
          create: {
            canShowCareer: true,
            canCreateCareer: true,
            canViewCareer: true,
            canUpdateCareer: true,
            canDeleteCareer: true,
          },
        },
      },
      select: { id: true },
    });
  });

  it("should be able to create careers data successfully", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app)
      .post("/api/v1/admins/careers")
      .set("Authorization", `Basic ${loginResponse.body.data.token}`)
      .send({
        title: "Software Engineer (React)",
        description: "Software Engineer",
        salary: "Rp. 1.900.000- Rp. 2.000.000",
        requirements: ["Requirement A", "Requirement B", "Requirement C"],
        type: "WEB",
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        glintsInfo: "https://glints.com",
        tags: ["Tag A", "Tag B", "Tag C"],
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully create admin career");
    expect(response.body.data).toEqual({
      id: expect.any(Number),
      title: "Software Engineer (React)",
      description: "Software Engineer",
      salary: "Rp. 1.900.000- Rp. 2.000.000",
      requirements: "Requirement A, Requirement B, Requirement C",
      isVisible: true,
      type: "WEB",
      linkedInInfo: "https://linkedin.com",
      jobStreetInfo: "https://jobstreet.co.id",
      glintsInfo: "https://glints.com",
      tags: "Tag A, Tag B, Tag C",
      authorId: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("should not be able to create careers data successfully - when no login", async () => {
    const response = await supertest(app)
      .post("/api/v1/admins/careers")
      .send({
        title: "Software Engineer (React)",
        description: "Software Engineer",
        salary: "Rp. 1.900.000- Rp. 2.000.000",
        requirements: ["Requirement A", "Requirement B", "Requirement C"],
        type: "WEB",
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        glintsInfo: "https://glints.com",
        tags: ["Tag A", "Tag B", "Tag C"],
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("TokenError: Unauthorized");
  });

  it("should not be able to create careers data successfully - when no permission", async () => {
    await prisma.adminPermission.update({
      where: {
        adminId: adminId.id,
      },
      data: {
        canCreateCareer: false,
      },
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/careers")
      .set("Authorization", `Basic ${loginResponse.body.data.token}`)
      .send({
        title: "Software Engineer (React)",
        description: "Software Engineer",
        salary: "Rp. 1.900.000- Rp. 2.000.000",
        requirements: ["Requirement A", "Requirement B", "Requirement C"],
        type: "WEB",
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        glintsInfo: "https://glints.com",
        tags: ["Tag A", "Tag B", "Tag C"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: You don't have permission to create admin");
  });

  it("should be able to create careers data successfully without linkedInInfo, jobStreetInfo, and glintsInfo", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/careers")
      .set("Authorization", `Basic ${loginResponse.body.data.token}`)
      .send({
        title: "Software Engineer (React)",
        description: "Software Engineer",
        salary: "Rp. 1.900.000- Rp. 2.000.000",
        requirements: ["Requirement A", "Requirement B", "Requirement C"],
        type: "WEB",
        tags: ["Tag A", "Tag B", "Tag C"],
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully create admin career");
    expect(response.body.data).toEqual({
      id: expect.any(Number),
      title: "Software Engineer (React)",
      description: "Software Engineer",
      salary: "Rp. 1.900.000- Rp. 2.000.000",
      requirements: "Requirement A, Requirement B, Requirement C",
      isVisible: true,
      type: "WEB",
      linkedInInfo: null,
      jobStreetInfo: null,
      glintsInfo: null,
      tags: "Tag A, Tag B, Tag C",
      authorId: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("should not be able to create careers data successfully - no sending title", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/careers")
      .set("Authorization", `Basic ${loginResponse.body.data.token}`)
      .send({
        description: "Software Engineer",
        salary: "Rp. 1.900.000- Rp. 2.000.000",
        requirements: ["Requirement A", "Requirement B", "Requirement C"],
        type: "WEB",
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        glintsInfo: "https://glints.com",
        tags: ["Tag A", "Tag B", "Tag C"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("PropertyError: Title is required");
  });

  it("should not be able to create careers data successfully - no sending description", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/careers")
      .set("Authorization", `Basic ${loginResponse.body.data.token}`)
      .send({
        title: "Software Engineer (React)",
        salary: "Rp. 1.900.000- Rp. 2.000.000",
        requirements: ["Requirement A", "Requirement B", "Requirement C"],
        type: "WEB",
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        glintsInfo: "https://glints.com",
        tags: ["Tag A", "Tag B", "Tag C"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("PropertyError: Description is required");
  });

  it("should not be able to create careers data successfully - no sending salary", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/careers")
      .set("Authorization", `Basic ${loginResponse.body.data.token}`)
      .send({
        title: "Software Engineer (React)",
        description: "Software Engineer",
        requirements: ["Requirement A", "Requirement B", "Requirement C"],
        type: "WEB",
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        glintsInfo: "https://glints.com",
        tags: ["Tag A", "Tag B", "Tag C"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("PropertyError: Salary is required");
  });

  it("should not be able to create careers data successfully - no sending requirements", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/careers")
      .set("Authorization", `Basic ${loginResponse.body.data.token}`)
      .send({
        title: "Software Engineer (React)",
        description: "Software Engineer",
        salary: "Rp. 1.900.000- Rp. 2.000.000",
        type: "WEB",
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        glintsInfo: "https://glints.com",
        tags: ["Tag A", "Tag B", "Tag C"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("PropertyError: Requirements is required");
  });

  it("should not be able to create careers data successfully - no sending type", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/careers")
      .set("Authorization", `Basic ${loginResponse.body.data.token}`)
      .send({
        title: "Software Engineer (React)",
        description: "Software Engineer",
        salary: "Rp. 1.900.000- Rp. 2.000.000",
        requirements: ["Requirement A", "Requirement B", "Requirement C"],
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        glintsInfo: "https://glints.com",
        tags: ["Tag A", "Tag B", "Tag C"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("PropertyError: Type is required");
  });

  it("should not be able to create careers data successfully - invalid type", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/careers")
      .set("Authorization", `Basic ${loginResponse.body.data.token}`)
      .send({
        title: "Software Engineer (React)",
        description: "Software Engineer",
        salary: "Rp. 1.900.000- Rp. 2.000.000",
        requirements: ["Requirement A", "Requirement B", "Requirement C"],
        type: "INVALID",
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        glintsInfo: "https://glints.com",
        tags: ["Tag A", "Tag B", "Tag C"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError:");
  });

  it("should not be able to create careers data successfully - no sending tags", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/careers")
      .set("Authorization", `Basic ${loginResponse.body.data.token}`)
      .send({
        title: "Software Engineer (React)",
        description: "Software Engineer",
        salary: "Rp. 1.900.000- Rp. 2.000.000",
        requirements: ["Requirement A", "Requirement B", "Requirement C"],
        type: "WEB",
        linkedInInfo: "https://linkedin.com",
        jobStreetInfo: "https://jobstreet.co.id",
        glintsInfo: "https://glints.com",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("PropertyError: Tags is required");
  });

  afterEach(async () => {
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });
});

describe("when admin want to get careers data in route GET /api/v1/admins/careers", () => {
  let adminId;

  beforeAll(async () => {
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);

    adminId = await prisma.admin.create({
      data: {
        email: "adminKonnco@konnco.com",
        password: hash,
        name: "Admin Konnco",
        phoneNumber: "087823322523",
        role: "ADMIN",
        permissions: {
          create: {
            canShowCareer: true,
            canCreateCareer: true,
            canViewCareer: true,
            canUpdateCareer: true,
            canDeleteCareer: true,
          },
        },
      },
      select: { id: true },
    });

    await prisma.career.createMany({
      data: [
        {
          title: "Software Engineer (React)",
          description: "Software Engineer",
          salary: "Rp. 1.900.000- Rp. 2.000.000",
          requirements: "Requirement A, Requirement B, Requirement C",
          type: "WEB",
          linkedInInfo: "https://linkedin.com",
          jobStreetInfo: "https://jobstreet.co.id",
          glintsInfo: "https://glints.com",
          tags: "Tag A, Tag B, Tag C",
          authorId: adminId.id,
        },
      ],
    });
  });

  afterEach(async () => {
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should be able to get careers data successfully", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers").set("Authorization", `Basic ${loginResponse.body.data.token}`);

    console.info(response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully get admin careers");
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe("Software Engineer (React)");
    response.body.data.forEach((career) => {
      expect(career).toHaveProperty("title");
      expect(career).toHaveProperty("description");
      expect(career).not.toHaveProperty("salary");
      expect(career).not.toHaveProperty("requirements");
      expect(career).toHaveProperty("type");
      expect(career).toHaveProperty("tags");
      expect(career).not.toHaveProperty("linkedInInfo");
      expect(career).not.toHaveProperty("createdAt");
    });
  });

  it("should not be able to get careers data successfully - when no permission", async () => {
    await prisma.adminPermission.update({
      where: {
        adminId: adminId.id,
      },
      data: {
        canShowCareer: false,
      },
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminKonnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/careers").set("Authorization", `Basic ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: You don't have permission to show admin careers");
  });
});
