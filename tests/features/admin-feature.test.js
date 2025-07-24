import { afterEach, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import bcrypt from "bcrypt";

import app from "../../src/app.js";
import { prisma } from "../../src/database.js";

beforeAll(async () => {
  await prisma.blog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.career.deleteMany();
  await prisma.adminPermission.deleteMany();
  await prisma.admin.deleteMany();
});

describe("when admin wants to login", () => {
  beforeAll(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);

    const createAdmin = await prisma.admin.create({
      data: {
        email: "xl5d5@konnco.com",
        password: hash,
        name: "Admin A",
        phoneNumber: "087823322523",
        role: "ADMIN",
        permissions: {
          create: {},
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

  it("should be able to returning token", async () => {
    const response = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xL5d5@konnco.com",
      password: "dontknowityet",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });
  });

  it("should not be able to returning token - invalid email", async () => {
    const response = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xL5d@konnco.com",
      password: "dontknowityet",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "AuthError: Username/Password is incorrect",
    });
  });

  it("should not be able to returning token - invalid password", async () => {
    const response = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xL5d5@konnco.com",
      password: "dontknowityet2",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "AuthError: Username/Password is incorrect",
    });
  });

  it("should not be able to returning token - invalid not using custom email", async () => {
    const response = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xL5d@gmail.com",
      password: "dontknowityet",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "ValidationError: Email must use @konnco.com",
    });
  });

  it("should not be able to returning token - invalid email and password", async () => {
    const response = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xL5d@konnco.com",
      password: "dontknowityet2",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "AuthError: Username/Password is incorrect",
    });
  });

  it("should not be able to returning token - no password properties", async () => {
    const response = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xL5d5@konnco.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "PropertyError: Password is required",
    });
  });

  it("should not be able to returning token - no email properties", async () => {
    const response = await supertest(app).post("/api/v1/admins/auth/login").send({
      password: "dontknowityet",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "PropertyError: Email is required",
    });
  });
});

describe("when admin want to get data in dashboard", () => {
  beforeAll(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);

    await prisma.admin.create({
      data: {
        email: "xl5d5@konnco.com",
        password: hash,
        name: "Admin A",
        phoneNumber: "087823322523",
        role: "ADMIN",
        blogs: {
          createMany: {
            data: [
              {
                title: "Blog A",
                content: "Content A",
                photo: "photosOfA1.jpg",
                type: "TECH",
                slug: "blog-a",
                isVisible: true,
              },
              {
                title: "Blog B",
                content: "Content B",
                photo: "photosOfB1.jpg",
                type: "TECH",
                slug: "blog-b",
                isVisible: true,
              },
              {
                title: "Blog C",
                content: "Content C",
                photo: "photosOfC1.jpg",
                type: "TECH",
                slug: "blog-c",
                isVisible: true,
              },
              {
                title: "Blog D",
                content: "Content D",
                photo: "photosOfD1.jpg",
                type: "TECH",
                slug: "blog-d",
                isVisible: true,
              },
              {
                title: "Blog E",
                content: "Content E",
                photo: "photosOfE1.jpg",
                type: "TECH",
                slug: "blog-e",
                isVisible: true,
              },
              {
                title: "Blog F",
                content: "Content F",
                photo: "photosOfF1.jpg",
                type: "TECH",
                slug: "blog-f",
                isVisible: true,
              },
            ],
          },
        },
        permissions: {
          create: {
            canShowApplication: true,
            canCreateApplication: true,
            canViewApplication: true,
            canUpdateApplication: true,
            canDeleteApplication: true,

            canShowCareer: true,
            canCreateCareer: true,
            canViewCareer: true,
            canUpdateCareer: true,
            canDeleteCareer: true,

            canShowProduct: true,
            canCreateProduct: true,
            canViewProduct: true,
            canUpdateProduct: true,
            canDeleteProduct: true,

            canShowBlog: true,
            canCreateBlog: true,
            canViewBlog: true,
            canUpdateBlog: true,
            canDeleteBlog: true,

            canShowAdmin: true,
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

  it("should be able to get data in dashboard", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xL5d5@konnco.com",
      password: "dontknowityet",
    });

    const token = responseLogin.body.data.token;

    const response = await supertest(app).get("/api/v1/admins/dashboard/overview").set("Authorization", `Basic ${token}`);


    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully get dashboard data");
  });

  it("should not be able to get data in dashboard - no authorization provided", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xL5d5@konnco.com",
      password: "dontknowityet",
    });

    const token = responseLogin.body.data.token;

    const response = await supertest(app).get("/api/v1/admins/dashboard/overview");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("TokenError: Unauthorized");
  });

  it("should not be able to get data in dashboard - no token after split", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xL5d5@konnco.com",
      password: "dontknowityet",
    });

    const token = responseLogin.body.data.token;

    const response = await supertest(app).get("/api/v1/admins/dashboard/overview").set("Authorization", token);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("TokenError: Unauthorized");
  });

  it("should not be able to get data in dashboard - wrong token", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xL5d5@konnco.com",
      password: "dontknowityet",
    });

    const token = responseLogin.body.data.token;

    const response = await supertest(app).get("/api/v1/admins/dashboard/overview").set("Authorization", `Basic ${token}123`);
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("TokenError: Unauthorized");
  });
});

afterAll(async () => {
  await prisma.application.deleteMany();
  await prisma.career.deleteMany();
  await prisma.adminPermission.deleteMany();
  await prisma.admin.deleteMany();
});
