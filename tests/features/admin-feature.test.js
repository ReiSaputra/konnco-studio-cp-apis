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

describe("when admin want to get data in dashboard route GET /api/v1/admins/dashboard/overview", () => {
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

describe("when admin want to get blogs data in route GET /api/v1/admins/blogs", () => {
  beforeAll(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);

    const createAdmin1 = await prisma.admin.create({
      data: {
        name: "Admin A",
        email: "adminA@konnco.com",
        password: hash,
        phoneNumber: "087843202523",
        role: "ADMIN",
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
      select: {
        id: true,
      },
    });

    const createAdmin2 = await prisma.admin.create({
      data: {
        name: "Admin B",
        email: "adminB@konnco.com",
        password: hash,
        phoneNumber: "087871202523",
        role: "ADMIN",
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
      select: {
        id: true,
      },
    });

    await prisma.blog.createMany({
      data: [
        { title: "Alpha", content: "Content Alpha", photo: "photo-alpha.jpg", type: "TECH", slug: "alpha", isVisible: true, authorId: createAdmin1.id },
        { title: "Bravo", content: "Content Bravo", photo: "photo-bravo.jpg", type: "BUSINESS", slug: "bravo", isVisible: false, authorId: createAdmin1.id },
        { title: "Charlie", content: "Content Charlie", photo: "photo-charlie.jpg", type: "NEWS", slug: "charlie", isVisible: true, authorId: createAdmin1.id },
        { title: "Delta", content: "Content Delta", photo: "photo-delta.jpg", type: "TUTORIAL", slug: "delta", isVisible: true, authorId: createAdmin1.id },
        { title: "Echo", content: "Content Echo", photo: "photo-echo.jpg", type: "OTHER", slug: "echo", isVisible: false, authorId: createAdmin1.id },
        { title: "Foxtrot", content: "Content Foxtrot", photo: "photo-foxtrot.jpg", type: "TECH", slug: "foxtrot", isVisible: true, authorId: createAdmin1.id },
        { title: "Golf", content: "Content Golf", photo: "photo-golf.jpg", type: "TECH", slug: "golf", isVisible: false, authorId: createAdmin1.id },
        { title: "Hotel", content: "Content Hotel", photo: "photo-hotel.jpg", type: "BUSINESS", slug: "hotel", isVisible: true, authorId: createAdmin1.id },
        { title: "India", content: "Content India", photo: "photo-india.jpg", type: "NEWS", slug: "india", isVisible: true, authorId: createAdmin1.id },
        { title: "Juliet", content: "Content Juliet", photo: "photo-juliet.jpg", type: "TUTORIAL", slug: "juliet", isVisible: false, authorId: createAdmin1.id },
        { title: "Kilo", content: "Content Kilo", photo: "photo-kilo.jpg", type: "OTHER", slug: "kilo", isVisible: true, authorId: createAdmin1.id },
        { title: "Lima", content: "Content Lima", photo: "photo-lima.jpg", type: "TECH", slug: "lima", isVisible: false, authorId: createAdmin1.id },
        { title: "Mike", content: "Content Mike", photo: "photo-mike.jpg", type: "BUSINESS", slug: "mike", isVisible: true, authorId: createAdmin1.id },
        { title: "November", content: "Content November", photo: "photo-november.jpg", type: "NEWS", slug: "november", isVisible: true, authorId: createAdmin1.id },
        { title: "Oscar", content: "Content Oscar", photo: "photo-oscar.jpg", type: "TUTORIAL", slug: "oscar", isVisible: false, authorId: createAdmin1.id },
        { title: "Papa", content: "Content Papa", photo: "photo-papa.jpg", type: "OTHER", slug: "papa", isVisible: true, authorId: createAdmin1.id },
        { title: "Quebec", content: "Content Quebec", photo: "photo-quebec.jpg", type: "TECH", slug: "quebec", isVisible: false, authorId: createAdmin1.id },
        { title: "Romeo", content: "Content Romeo", photo: "photo-romeo.jpg", type: "BUSINESS", slug: "romeo", isVisible: true, authorId: createAdmin1.id },
        { title: "Sierra", content: "Content Sierra", photo: "photo-sierra.jpg", type: "NEWS", slug: "sierra", isVisible: false, authorId: createAdmin1.id },
        { title: "Tango", content: "Content Tango", photo: "photo-tango.jpg", type: "TUTORIAL", slug: "tango", isVisible: true, authorId: createAdmin1.id },

        { title: "Uniform", content: "Content Uniform", photo: "photo-uniform.jpg", type: "TECH", slug: "uniform", isVisible: true, authorId: createAdmin2.id },
        { title: "Victor", content: "Content Victor", photo: "photo-victor.jpg", type: "BUSINESS", slug: "victor", isVisible: false, authorId: createAdmin2.id },
        { title: "Whiskey", content: "Content Whiskey", photo: "photo-whiskey.jpg", type: "NEWS", slug: "whiskey", isVisible: true, authorId: createAdmin2.id },
        { title: "Xray", content: "Content Xray", photo: "photo-xray.jpg", type: "TUTORIAL", slug: "xray", isVisible: true, authorId: createAdmin2.id },
        { title: "Yankee", content: "Content Yankee", photo: "photo-yankee.jpg", type: "OTHER", slug: "yankee", isVisible: false, authorId: createAdmin2.id },
        { title: "Zulu", content: "Content Zulu", photo: "photo-zulu.jpg", type: "TECH", slug: "zulu", isVisible: true, authorId: createAdmin2.id },
        { title: "Alpha2", content: "Content Alpha2", photo: "photo-alpha2.jpg", type: "TECH", slug: "alpha2", isVisible: false, authorId: createAdmin2.id },
        { title: "Bravo2", content: "Content Bravo2", photo: "photo-bravo2.jpg", type: "BUSINESS", slug: "bravo2", isVisible: true, authorId: createAdmin2.id },
        { title: "Charlie2", content: "Content Charlie2", photo: "photo-charlie2.jpg", type: "NEWS", slug: "charlie2", isVisible: true, authorId: createAdmin2.id },
        { title: "Delta2", content: "Content Delta2", photo: "photo-delta2.jpg", type: "TUTORIAL", slug: "delta2", isVisible: false, authorId: createAdmin2.id },
        { title: "Echo2", content: "Content Echo2", photo: "photo-echo2.jpg", type: "OTHER", slug: "echo2", isVisible: true, authorId: createAdmin2.id },
        { title: "Foxtrot2", content: "Content Foxtrot2", photo: "photo-foxtrot2.jpg", type: "TECH", slug: "foxtrot2", isVisible: false, authorId: createAdmin2.id },
        { title: "Golf2", content: "Content Golf2", photo: "photo-golf2.jpg", type: "BUSINESS", slug: "golf2", isVisible: true, authorId: createAdmin2.id },
        { title: "Hotel2", content: "Content Hotel2", photo: "photo-hotel2.jpg", type: "NEWS", slug: "hotel2", isVisible: true, authorId: createAdmin2.id },
        { title: "India2", content: "Content India2", photo: "photo-india2.jpg", type: "TUTORIAL", slug: "india2", isVisible: false, authorId: createAdmin2.id },
        { title: "Juliet2", content: "Content Juliet2", photo: "photo-juliet2.jpg", type: "OTHER", slug: "juliet2", isVisible: true, authorId: createAdmin2.id },
        { title: "Kilo2", content: "Content Kilo2", photo: "photo-kilo2.jpg", type: "TECH", slug: "kilo2", isVisible: false, authorId: createAdmin2.id },
        { title: "Lima2", content: "Content Lima2", photo: "photo-lima2.jpg", type: "BUSINESS", slug: "lima2", isVisible: true, authorId: createAdmin2.id },
        { title: "Mike2", content: "Content Mike2", photo: "photo-mike2.jpg", type: "NEWS", slug: "mike2", isVisible: false, authorId: createAdmin2.id },
        { title: "November2", content: "Content November2", photo: "photo-november2.jpg", type: "TUTORIAL", slug: "november2", isVisible: true, authorId: createAdmin2.id },
        { title: "Oscar2", content: "Content Oscar2", photo: "photo-oscar2.jpg", type: "OTHER", slug: "oscar2", isVisible: false, authorId: createAdmin2.id },
      ],
    });
  });

  it("should be able to get admin blog data successfully", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminA@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app).get("/api/v1/admins/blogs").set("Authorization", `Basic ${responseLogin.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully get admin blogs");
    expect(response.body.data).toHaveLength(10);
    response.body.data.forEach((blog) => {
      expect(blog).toHaveProperty("title");
      expect(blog).toHaveProperty("content");
      expect(blog).toHaveProperty("slug");
      expect(blog).toHaveProperty("type");
      expect(blog).toHaveProperty("createdAt");
      expect(blog).not.toHaveProperty("photo");
    });
  });

  it("should be able to get admin blog data successfully but with filters status and category", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminA@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app).get("/api/v1/admins/blogs?status=visible&category=tech").set("Authorization", `Basic ${responseLogin.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully get admin blogs");
    expect(response.body.data).toHaveLength(2);
    response.body.data.forEach((blog) => {
      expect(blog).toHaveProperty("title");
      expect(blog).toHaveProperty("content");
      expect(blog).toHaveProperty("slug");
      expect(blog).toHaveProperty("type");
      expect(blog).toHaveProperty("createdAt");
      expect(blog).not.toHaveProperty("photo");
    });
  });

  it("should be able to get admin blog data successfully but with filters page", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminA@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app).get("/api/v1/admins/blogs?page=2").set("Authorization", `Basic ${responseLogin.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully get admin blogs");
    expect(response.body.data).toHaveLength(10);
    response.body.data.forEach((blog) => {
      expect(blog).toHaveProperty("title");
      expect(blog).toHaveProperty("content");
      expect(blog).toHaveProperty("slug");
      expect(blog).toHaveProperty("type");
      expect(blog).toHaveProperty("createdAt");
      expect(blog).not.toHaveProperty("photo");
    });
  });

  it("should be able to get admin blog data successfully but with filters search", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminA@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app).get("/api/v1/admins/blogs?search=queb").set("Authorization", `Basic ${responseLogin.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully get admin blogs");
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe("Quebec");
    response.body.data.forEach((blog) => {
      expect(blog).toHaveProperty("title");
      expect(blog).toHaveProperty("content");
      expect(blog).toHaveProperty("slug");
      expect(blog).toHaveProperty("type");
      expect(blog).toHaveProperty("createdAt");
      expect(blog).not.toHaveProperty("photo");
    });
  });

  it("should not be able to get admin blog data successfully - invalid query parameters value on property page", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminA@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app).get("/api/v1/admins/blogs?page=john").set("Authorization", `Basic ${responseLogin.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError");
  });

  it("shoud not be able to get admin blog data successfully - no authorization provided", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminA@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });
    
    const response = await supertest(app).get("/api/v1/admins/blogs");
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("TokenError: Unauthorized");
  });

  afterEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });
});

describe("when admin want to get detail blog data in route GET /api/v1/admins/blogs/:blogSlug", () => {});

afterAll(async () => {
  await prisma.application.deleteMany();
  await prisma.career.deleteMany();
  await prisma.adminPermission.deleteMany();
  await prisma.admin.deleteMany();
});
