import { afterEach, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import { prisma } from "../../../../src/database.js";
import supertest from "supertest";
import app from "../../../../src/app.js";
import bcrypt from "bcrypt";
import path from "path";

describe("when admin want to get products data in route GET /api/v1/admins/products", () => {
  beforeAll(async () => {
    await prisma.product.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.admin.deleteMany();
  });

  let productId;

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);

    await prisma.admin.create({
      data: {
        email: "xl5d5@konnco.com",
        password: hash,
        name: "Admin A",
        phoneNumber: "087823322523",
        role: "ADMIN",
        permissions: {
          create: {
            canShowProduct: true,
            canViewProduct: true,
            canCreateProduct: true,
            canUpdateProduct: true,
            canDeleteProduct: true,
          },
        },
      },
    });

    productId = await prisma.product.create({
      data: {
        title: "Product A",
        description: "Description A",
        advantage: "Advantage A",
        mainFeature: "Main Feature A",
        mainPhoto: "product-a.jpg",
      },
      select: {
        id: true,
      },
    });
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should be able to get products data successfully", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/products").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe("Product A");
  });

  it("should not be able to get products data - unauthorized", async () => {
    const response = await supertest(app).get("/api/v1/admins/products");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("TokenError: Unauthorized");
  });

  it("should not be able to get products data - no permisssions", async () => {
    await prisma.admin.update({
      where: {
        email: "xl5d5@konnco.com",
      },
      data: {
        permissions: {
          update: {
            canShowProduct: false,
          },
        },
      },
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/products").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: You don't have permission to show admin products");
  });

  it("should be able to get products data but not found any data", async () => {
    await prisma.product.deleteMany();

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/products").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
  });
});

describe("when admin want to get product detail data in route GET /api/v1/admins/products/:productId", () => {
  beforeAll(async () => {
    await prisma.product.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.admin.deleteMany();
  });

  let productId;

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);

    await prisma.admin.create({
      data: {
        email: "xl5d5@konnco.com",
        password: hash,
        name: "Admin A",
        phoneNumber: "087823322523",
        role: "ADMIN",
        permissions: {
          create: {
            canShowProduct: true,
            canViewProduct: true,
            canCreateProduct: true,
            canUpdateProduct: true,
            canDeleteProduct: true,
          },
        },
      },
    });

    productId = await prisma.product.create({
      data: {
        title: "Product A",
        description: "Description A",
        advantage: "Advantage A",
        mainFeature: "Main Feature A",
        mainPhoto: "product-a.jpg",
      },
      select: {
        id: true,
      },
    });
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should be able to get product detail data successfully", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get(`/api/v1/admins/products/${productId.id}`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Product A");
  });

  it("should not be able to get product data - unauthorized", async () => {
    const response = await supertest(app).get(`/api/v1/admins/products/${productId.id}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("TokenError: Unauthorized");
  });

  it("should not be able to get product data - no permissions", async () => {
    await prisma.admin.update({
      where: {
        email: "xl5d5@konnco.com",
      },
      data: {
        permissions: {
          update: {
            canViewProduct: false,
          },
        },
      },
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get(`/api/v1/admins/products/${productId.id}`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: You don't have permission to view admin products");
  });

  it("should not be able to get product data - data type wrong validation", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get(`/api/v1/admins/products/invalid-product-id`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError:");
  });

  it("should not be able to get product data - data not found", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get(`/api/v1/admins/products/10`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: Product not found");
  });
});

describe("when admin want to create product data in route POST /api/v1/admins/products", () => {
  const photosPath = path.resolve(__dirname, "../../../samples/img/download.jpg");
  const photosPathWrongMime = path.resolve(__dirname, "../../../samples/img/Screenshot 2025-07-28 172946.png");

  beforeAll(async () => {
    await prisma.product.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
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
          create: {
            canShowProduct: true,
            canViewProduct: true,
            canCreateProduct: true,
            canUpdateProduct: true,
            canDeleteProduct: true,
          },
        },
      },
    });
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should be able to create product data successfully - 3 photos", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/products")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`)
      .field("title", "Product A")
      .field("description", "Product A description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("mainFeature", "Product A main feature")
      .field("advantage", "Product A advantage")
      .attach("photos", photosPath)
      .attach("photos", photosPath)
      .attach("photos", photosPath);

    expect(response.status).toBe(200);
  });

  it("should be able to create product data successfully - 1 photo", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/products")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`)
      .field("title", "Product A")
      .field("description", "Product A description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("mainFeature", "Product A main feature")
      .field("advantage", "Product A advantage")
      .attach("photos", photosPath);

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Product A");
  });

  it("should not be able to create product data - 4 photo or more", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/products")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`)
      .field("title", "Product A")
      .field("description", "Product A description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("mainFeature", "Product A main feature")
      .field("advantage", "Product A advantage")
      .attach("photos", photosPath)
      .attach("photos", photosPath)
      .attach("photos", photosPath)
      .attach("photos", photosPath);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("MulterError: Unexpected field");
  });

  it("should not be able to create product data - 0 photo", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/products")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`)
      .field("title", "Product A")
      .field("description", "Product A description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("mainFeature", "Product A main feature")
      .field("advantage", "Product A advantage");

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("FileUploadError: Either");
  });

  it("should not be able to create product data - wrong file mime type on the first photo", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/products")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`)
      .field("title", "Product A")
      .field("description", "Product A description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("mainFeature", "Product A main feature")
      .field("advantage", "Product A advantage")
      .attach("photos", photosPathWrongMime);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("FileUploadError: Either");
  });

  it("should be able to create product data but the second photo is not be uploaded - wrong file mime type on the second photo", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/products")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`)
      .field("title", "Product A")
      .field("description", "Product A description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("mainFeature", "Product A main feature")
      .field("advantage", "Product A advantage")
      .attach("photos", photosPath)
      .attach("photos", photosPathWrongMime);

    console.info(response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("Successfully create admin product");
  });

  it("should not be able to create product data - no title", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/products")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`)
      .field("description", "Product A description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("mainFeature", "Product A main feature")
      .field("advantage", "Product A advantage")
      .attach("photos", photosPath)
      .attach("photos", photosPathWrongMime);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Title is required");
  });

  it("should not be able to create product data - no description", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/products")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`)
      .field("title", "Product A")
      .field("mainFeature", "Product A main feature")
      .field("advantage", "Product A advantage")
      .attach("photos", photosPath)
      .attach("photos", photosPathWrongMime);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Description is required");
  });

  it("should not be able to create product data - no main feature", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/products")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`)
      .field("title", "Product A")
      .field("description", "Product A description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("advantage", "Product A advantage")
      .attach("photos", photosPath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Main Feature is required");
  });

  it("should not be able to create product data - no advantage", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .post("/api/v1/admins/products")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`)
      .field("title", "Product A")
      .field("description", "Product A description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("mainFeature", "Product A main feature")
      .attach("photos", photosPath);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Advantage is required");
  });

  it("should not be able to create product data - no authorization", async () => {
    const response = await supertest(app)
      .post("/api/v1/admins/products")
      .field("title", "Product A")
      .field("description", "Product A description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec augue ex. Nulla condimentum tempus ultrices. Donec sed sagittis dolor. Duis a lectus eu justo scelerisque vestibulum.")
      .field("mainFeature", "Product A main feature")
      .field("advantage", "Product A advantage");

    expect(response.status).toBe(401);
    expect(response.body.message).toContain("Unauthorized");
  });
});

describe("when admin want to update product data in route PUT /api/v1/admins/products/:productId", () => {});

describe("when admin want to delete product data in route DELETE /api/v1/admins/products/:productId", () => {});
