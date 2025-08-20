import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
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

describe("when admin wants to login on GET /api/v1/admins/auth/login", () => {
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
        id: expect.any(String),
        name: "Admin A",
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

afterAll(async () => {
  await prisma.blog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.career.deleteMany();
  await prisma.adminPermission.deleteMany();
  await prisma.admin.deleteMany();
});
