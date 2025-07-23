import { beforeAll, describe, expect, it } from "@jest/globals";
import { prisma } from "../../src/database.js";
import app from "../../src/app.js";
import supertest from "supertest";

describe("when users get blogs", () => {
  beforeAll(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    await prisma.blog.create({
      data: {
        title: "Blog A",
        content: "Content A",
        photo: "photosOfA1.jpg",
        type: "TECH",
        slug: "blog-a",
        isVisible: true,
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
      },
      select: {
        slug: true,
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

  it("should be able to get blogs successfully", async () => {
    const response = await supertest(app).get("/api/v1/blogs");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully get blogs",
      data: [{ title: "Blog A", content: "Content A", photo: "photosOfA1.jpg", type: "TECH", author: { name: "Admin A" }, slug: "blog-a", createdAt: expect.any(String) }],
    });
  });

  it("should be able to get blogs successfully but did not find any", async () => {
    await prisma.blog.deleteMany();

    const response = await supertest(app).get("/api/v1/blogs");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully get blogs",
      data: [],
    });
  });
});

describe("when users get detail blogs", () => {
  beforeAll(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    await prisma.blog.create({
      data: {
        title: "Blog A",
        content: "Content A",
        photo: "photosOfA1.jpg",
        type: "TECH",
        slug: "blog-a",
        isVisible: true,
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
      },
      select: {
        slug: true,
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

  it("should be able to get blog detail successfully", async () => {
    const response = await supertest(app).get("/api/v1/blogs/blog-a");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully get blog detail",
      data: {
        title: "Blog A",
        content: "Content A",
        photo: "photosOfA1.jpg",
        type: "TECH",
        author: { name: "Admin A" },
        createdAt: expect.any(String),
      },
    });
  });

  it("should not be able to get blog detail - invalid blog slug params", async () => {
    const response = await supertest(app).get("/api/v1/blogs/invalid-slug");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Error: Blog not found",
    });
  });
});
