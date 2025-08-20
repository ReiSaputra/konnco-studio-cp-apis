import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { prisma } from "../../../src/database.js";
import supertest from "supertest";
import app from "../../../src/app.js";
import bcrypt from "bcrypt";

describe("GET /super-admins/admins", () => {
  beforeEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.admin.create({
      data: {
        email: "atminlohya@konnco.com",
        password: await bcrypt.hash("dontknowityet", 10),
        name: "Admin A",
        role: "SUPER_ADMIN",
        phoneNumber: "087823322523",
        permissions: {
          create: {
            canCreateAdmin: true,
            canShowAdmin: true,
            canViewAdmin: true,
            canUpdateAdmin: true,
            canDeleteAdmin: true,
          },
        },
      },
    });

    await prisma.admin.createMany({
      data: [
        {
          email: "xl5d5@konnco.com",
          password: await bcrypt.hash("dontknowityet", 10),
          name: "Admin B",
          role: "ADMIN",
          phoneNumber: "081823322523",
        },
        {
          email: "xl5d6@konnco.com",
          password: await bcrypt.hash("dontknowityet", 10),
          name: "Admin C",
          role: "ADMIN",
          phoneNumber: "081823322524",
        },
        {
          email: "xl5d7@konnco.com",
          password: await bcrypt.hash("dontknowityet", 10),
          name: "Admin D",
          role: "ADMIN",
          phoneNumber: "081823322525",
        },
      ],
    });
  });

  afterEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should pass - get admins", async () => {
    const login = await supertest(app).post("/api/v1/admins/auth/login").send({ email: "atminlohya@konnco.com", password: "dontknowityet" });
    const token = login.body.data.token;

    const response = await supertest(app).get("/api/v1/super-admins/admins").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - permissions not allowed", async () => {
    await prisma.admin.update({
      where: {
        email: "atminlohya@konnco.com",
      },
      data: {
        permissions: {
          update: {
            canCreateAdmin: false,
            canShowAdmin: false,
            canViewAdmin: false,
            canUpdateAdmin: false,
            canDeleteAdmin: false,
          },
        },
      },
    });

    const login = await supertest(app).post("/api/v1/admins/auth/login").send({ email: "atminlohya@konnco.com", password: "dontknowityet" });
    const token = login.body.data.token;

    const response = await supertest(app).get("/api/v1/super-admins/admins").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Error: You don't have permission");
  });

  it("should pass - get admin with filter search name", async () => {
    const login = await supertest(app).post("/api/v1/admins/auth/login").send({ email: "atminlohya@konnco.com", password: "dontknowityet" });
    const token = login.body.data.token;

    const response = await supertest(app).get("/api/v1/super-admins/admins?search=Admin C").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should pass - get admin with filter role SUPER_ADMIN", async () => {
    const login = await supertest(app).post("/api/v1/admins/auth/login").send({ email: "atminlohya@konnco.com", password: "dontknowityet" });
    const token = login.body.data.token;

    const response = await supertest(app).get("/api/v1/super-admins/admins?role=SUPER_ADMIN").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});

describe("GET /super-admins/admins/:adminId", () => {
  beforeEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.admin.create({
      data: {
        email: "xl5d5@konnco.com",
        password: await bcrypt.hash("dontknowityet", 10),
        name: "Admin A",
        role: "SUPER_ADMIN",
        phoneNumber: "087823322523",
        permissions: {
          create: {
            canCreateAdmin: true,
            canShowAdmin: true,
            canViewAdmin: true,
            canUpdateAdmin: true,
            canDeleteAdmin: true,
          },
        },
      },
    });

    await prisma.admin.createMany({
      data: [
        {
          email: "xl5d1@konnco.com",
          password: await bcrypt.hash("dontknowityet", 10),
          name: "Admin B",
          role: "ADMIN",
          phoneNumber: "081823322523",
        },
        {
          email: "xl5d6@konnco.com",
          password: await bcrypt.hash("dontknowityet", 10),
          name: "Admin C",
          role: "ADMIN",
          phoneNumber: "081823322524",
        },
        {
          email: "xl5d7@konnco.com",
          password: await bcrypt.hash("dontknowityet", 10),
          name: "Admin D",
          role: "ADMIN",
          phoneNumber: "081823322525",
        },
      ],
    });
  });

  afterEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should pass - get admin by id", async () => {
    const user = await prisma.admin.findUnique({ where: { email: "xl5d7@konnco.com" }, select: { id: true } });
    const login = await supertest(app).post("/api/v1/admins/auth/login").send({ email: "xl5d5@konnco.com", password: "dontknowityet" });
    const token = login.body.data.token;

    const response = await supertest(app).get(`/api/v1/super-admins/admins/${user.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - get admin by id - not found", async () => {
    const login = await supertest(app).post("/api/v1/admins/auth/login").send({ email: "xl5d5@konnco.com", password: "dontknowityet" });
    const token = login.body.data.token;

    const response = await supertest(app).get("/api/v1/super-admins/admins/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("should fail - no permission", async () => {
    await prisma.admin.update({
      where: { email: "xl5d5@konnco.com" },
      data: {
        permissions: {
          update: {
            canCreateAdmin: false,
            canShowAdmin: false,
            canViewAdmin: false,
            canUpdateAdmin: false,
            canDeleteAdmin: false,
          },
        },
      },
    });

    const login = await supertest(app).post("/api/v1/admins/auth/login").send({ email: "xl5d5@konnco.com", password: "dontknowityet" });
    const token = login.body.data.token;

    const response = await supertest(app).get("/api/v1/super-admins/admins/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});

describe("POST /super-admins/admins", () => {
  beforeEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.admin.create({
      data: {
        email: "xl5d5@konnco.com",
        password: await bcrypt.hash("dontknowityet", 10),
        name: "Admin A",
        role: "SUPER_ADMIN",
        phoneNumber: "087823322523",
        permissions: {
          create: {
            canCreateAdmin: true,
            canShowAdmin: true,
            canViewAdmin: true,
            canUpdateAdmin: true,
            canDeleteAdmin: true,
          },
        },
      },
    });
  });

  afterEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should pass - create admin", async () => {
    const login = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/super-admins/admins")
      .send({
        email: "amethyst@konnco.com",
        name: "Admin A",
        phoneNumber: "087824322523",
        role: "ADMIN",
      })
      .set("Authorization", `Bearer ${login.body.data.token}`);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Successfully created admin");
  });

  it("should fail - invalid email", async () => {
    const login = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/super-admins/admins")
      .send({
        email: "amethystkonnco.com",
        name: "Admin A",
        phoneNumber: "087824322523",
        role: "ADMIN",
      })
      .set("Authorization", `Bearer ${login.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError");
  });

  it("should fail - email already exist", async () => {
    const login = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/super-admins/admins")
      .send({
        email: "xl5d5@konnco.com",
        name: "Admin A",
        phoneNumber: "087824322523",
        role: "ADMIN",
      })
      .set("Authorization", `Bearer ${login.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Email Admin already exist");
  });
});

describe("PUT /super-admins/admins/:adminId", () => {
  beforeEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.admin.create({
      data: {
        email: "xl5d5@konnco.com",
        password: await bcrypt.hash("dontknowityet", 10),
        name: "Admin A",
        role: "SUPER_ADMIN",
        phoneNumber: "087823322523",
        permissions: {
          create: {
            canCreateAdmin: true,
            canShowAdmin: true,
            canViewAdmin: true,
            canUpdateAdmin: true,
            canDeleteAdmin: true,
          },
        },
      },
    });

    await prisma.admin.createMany({
      data: [
        {
          email: "xl5d1@konnco.com",
          password: await bcrypt.hash("dontknowityet", 10),
          name: "Admin B",
          role: "ADMIN",
          phoneNumber: "087823322529",
        },
      ],
    });
  });

  afterEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should pass - update admin", async () => {
    const admin = await prisma.admin.findUnique({
      where: {
        email: "xl5d1@konnco.com",
      },
    });

    const login = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .put(`/api/v1/super-admins/admins/${admin.id}`)
      .send({
        name: "Admin A",
        email: "xl5c5@konnco.com",
        role: "ADMIN",
        phoneNumber: "087825322523",
      })
      .set("Authorization", `Bearer ${login.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully updated admin");
  });

  it("should fail - invalid email", async () => {
    const admin = await prisma.admin.findUnique({
      where: {
        email: "xl5d1@konnco.com",
      },
    });

    const login = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .put(`/api/v1/super-admins/admins/${admin.id}`)
      .send({
        name: "Admin A",
        email: "xl5c5konnco.com",
        role: "ADMIN",
        phoneNumber: "087825322523",
      })
      .set("Authorization", `Bearer ${login.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError");
  });

  it("should fail - email already exist", async () => {
    const admin = await prisma.admin.findUnique({
      where: {
        email: "xl5d1@konnco.com",
      },
    });

    const login = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .put(`/api/v1/super-admins/admins/${admin.id}`)
      .send({
        name: "Admin A",
        email: "xl5d5@konnco.com",
        role: "ADMIN",
        phoneNumber: "087825322523",
      })
      .set("Authorization", `Bearer ${login.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Email Admin already exist");
  });

  it("should fail - invalid role", async () => {
    const admin = await prisma.admin.findUnique({
      where: {
        email: "xl5d1@konnco.com",
      },
    });

    const login = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .put(`/api/v1/super-admins/admins/${admin.id}`)
      .send({
        name: "Admin A",
        email: "xl5c5@konnco.com",
        role: "SUPER",
        phoneNumber: "087825322523",
      })
      .set("Authorization", `Bearer ${login.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError");
  });

  it("should fail - phone number exists", async () => {
    const admin = await prisma.admin.findUnique({
      where: {
        email: "xl5d1@konnco.com",
      },
    });

    const login = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .put(`/api/v1/super-admins/admins/${admin.id}`)
      .send({
        name: "Admin A",
        email: "xl5c5@konnco.com",
        role: "ADMIN",
        phoneNumber: "087823322523",
      })
      .set("Authorization", `Bearer ${login.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Error: Phone Number Admin already exist");
  });
});

describe.only("DELETE /super-admins/admins/:adminId", () => {
  beforeEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.admin.create({
      data: {
        email: "xl5d5@konnco.com",
        password: await bcrypt.hash("dontknowityet", 10),
        name: "Admin A",
        role: "SUPER_ADMIN",
        phoneNumber: "087823322523",
        permissions: {
          create: {
            canCreateAdmin: true,
            canShowAdmin: true,
            canViewAdmin: true,
            canUpdateAdmin: true,
            canDeleteAdmin: true,
          },
        },
      },
    });

    await prisma.admin.createMany({
      data: [
        {
          email: "xl5d1@konnco.com",
          password: await bcrypt.hash("dontknowityet", 10),
          name: "Admin B",
          role: "ADMIN",
          phoneNumber: "087823322529",
        },
      ],
    });
  });

  afterEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should pass - delete admin", async () => {
    const admin = await prisma.admin.findUnique({
      where: {
        email: "xl5d1@konnco.com",
      },
    });

    const login = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).delete(`/api/v1/super-admins/admins/${admin.id}`).set("Authorization", `Bearer ${login.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("Successfully deleted admin");
  });

  it("should fail - no admin found", async () => {
    const login = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).delete(`/api/v1/super-admins/admins/invalid-admin-id`).set("Authorization", `Bearer ${login.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Error: Admin not found");
  });
});
