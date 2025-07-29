import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import { prisma } from "../../../../src/database.js";
import bcrypt from "bcrypt";
import app from "../../../../src/app.js";
import supertest from "supertest";
import path from "path";

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

describe("when admin want to get detail blog data in route GET /api/v1/admins/blogs/:blogSlug", () => {
  beforeAll(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);
    const admin = await prisma.admin.create({
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

    await prisma.blog.createMany({
      data: [
        {
          title: "Quebec",
          content: "Quebec",
          slug: "quebec",
          type: "TECH",
          authorId: admin.id,
          photo: "/photos/blogs/1.jpg",
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

  it("should be able to get admin blog detail data successfully", async () => {
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

    const response = await supertest(app).get("/api/v1/admins/blogs/quebec").set("Authorization", `Basic ${responseLogin.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully get admin blog detail");
    expect(response.body.data.title).toBe("Quebec");
  });

  it("should not be able to get admin blog detail data successfully - blog not found", async () => {
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

    const response = await supertest(app).get("/api/v1/admins/blogs/asterix").set("Authorization", `Basic ${responseLogin.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: Blog not found");
  });

  it("should not be able to get admin blog detail data successfully - number validation blogSlug", async () => {
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

    const response = await supertest(app).get("/api/v1/admins/blogs/1").set("Authorization", `Basic ${responseLogin.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: Blog not found");
  });
});

describe("when admin want to create blog data in route POST /api/v1/admins/blogs", () => {
  const filePath = path.resolve(__dirname, "../../../samples/img/konco2.jpg");
  const filePath2 = path.resolve(__dirname, "../../../samples/file/[2] PRD - Konnco Studio Company Profile.pdf");

  let admin;

  beforeAll(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);

    admin = await prisma.admin.create({
      data: {
        name: "Admin Konnco",
        email: "adminkonnco@konnco.com",
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
  });

  it("should be able to create blog data successfully", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of A")
      .field("slug", "news-of-a")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully create admin blog");
  });

  it("should not be able to create blog data successfully - no sending title", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("slug", "news-of-a")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Title is required");
  });

  it("should not be able to create blog data successfully - no sending slug", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of A")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Slug is required");
  });

  it("should not be able to create blog data successfully - no sending content", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of A")
      .field("slug", "slug-of-a")
      .field("content", "")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Content is required");
  });

  it("should not be able to create blog data successfully - no sending content", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of A")
      .field("slug", "slug-of-a")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NONE")
      .attach("photo", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError");
  });

  it("should not be able to create blog data successfully - no sending photo", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of A")
      .field("slug", "slug-of-a")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS");

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Either Photo");
  });

  it("should not be able to create blog data successfully - invalid mime type photo", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of A")
      .field("slug", "slug-of-a")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .field("photo", filePath2);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Either Photo");
  });

  it("should not be able to create blog data successfully - admin is not allowed on permission", async () => {
    await prisma.adminPermission.update({
      where: {
        adminId: admin.id,
      },
      data: {
        canCreateBlog: false,
      },
    });

    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const response = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of A")
      .field("slug", "slug-of-a")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Error: You don't have permission to create blog");
  });

  afterEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });
});

describe("when admin want to edit blog data in route PUT /api/v1/admins/blogs/:blogSlug", () => {
  const filePath = path.resolve(__dirname, "../../../samples/img/konco2.jpg");
  let admin;

  beforeAll(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);

    admin = await prisma.admin.create({
      data: {
        name: "Admin Konnco",
        email: "adminkonnco@konnco.com",
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
  });

  afterEach(async () => {
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should be able to edit blog data successfully", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const responseCreate = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of A")
      .field("slug", "news-of-a")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(responseCreate.status).toBe(200);
    expect(responseCreate.body.message).toBe("Successfully create admin blog");

    const blog = await prisma.blog.findUnique({
      where: {
        slug: "news-of-a",
      },
      select: {
        slug: true,
      },
    });

    const response = await supertest(app)
      .put(`/api/v1/admins/blogs/${blog.slug}`)
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of B")
      .field("slug", "news-of-b")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully update admin blog detail");
  });

  it("should not be able to edit blog data - invalid blog slug params", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const responseCreate = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of A")
      .field("slug", "news-of-a")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(responseCreate.status).toBe(200);
    expect(responseCreate.body.message).toBe("Successfully create admin blog");

    const response = await supertest(app)
      .put("/api/v1/admins/blogs/invalid-blog-slug")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of B")
      .field("slug", "news-of-b")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: Blog not found");
  });

  it("should not be able to edit blog data - invalid blog slug params", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const responseCreate = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of A")
      .field("slug", "news-of-a")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(responseCreate.status).toBe(200);
    expect(responseCreate.body.message).toBe("Successfully create admin blog");

    const blog = await prisma.blog.findUnique({
      where: {
        slug: "news-of-a",
      },
      select: {
        slug: true,
      },
    });

    const response = await supertest(app)
      .put("/api/v1/admins/blogs/invalid-blog-slug")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of B")
      .field("slug", "news-of-b")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: Blog not found");
  });

  it("should not be able to edit blog data - no sending title", async () => {
    const responseLogin = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "adminkonnco@konnco.com",
      password: "dontknowityet",
    });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: expect.any(String),
      },
    });

    const responseCreate = await supertest(app)
      .post("/api/v1/admins/blogs")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("title", "News of A")
      .field("slug", "news-of-a")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(responseCreate.status).toBe(200);
    expect(responseCreate.body.message).toBe("Successfully create admin blog");

    const blog = await prisma.blog.findUnique({
      where: {
        slug: "news-of-a",
      },
      select: {
        slug: true,
      },
    });

    const response = await supertest(app)
      .put("/api/v1/admins/blogs/invalid-blog-slug")
      .set("Authorization", `Basic ${responseLogin.body.data.token}`)
      .field("authorId", admin.id)
      .field("slug", "news-of-b")
      .field("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("type", "NEWS")
      .attach("photo", filePath);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("PropertyError: Title is required");
  });
});

afterAll(async () => {
  await prisma.blog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.career.deleteMany();
  await prisma.adminPermission.deleteMany();
  await prisma.admin.deleteMany();
});
