import supertest from "supertest";
import { describe, expect, it, beforeAll, beforeEach, afterAll } from "@jest/globals";
import app from "../../src/app.js";
import { prisma } from "../../src/database.js";

describe("when users access GET /api/v1/products", () => {
  beforeAll(async () => {
    await prisma.product.deleteMany();
  });

  beforeEach(async () => {
    await prisma.product.create({
      data: {
        title: "Product A",
        description: "Description A",
        advantage: "Advantage A",
        mainFeature: "Main Feature A",
        mainPhoto: "product-a.jpg",
      },
    });
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
  });

  it("should be able to get products successfully", async () => {
    const response = await supertest(app).get("/api/v1/products");

    console.info(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully get products",
      data: [
        {
          id: expect.any(Number),
          title: "Product A",
          description: "Description A",
          mainPhoto: "product-a.jpg",
        },
      ],
    });
  });

  it("should be able to get products successfully but did not find any", async () => {
    await prisma.product.deleteMany();

    const response = await supertest(app).get("/api/v1/products");

    console.info(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully get products",
      data: [],
    });
  });
});

describe("when users access GET /api/v1/products/:productId", () => {
  let productId;

  beforeAll(async () => {
    await prisma.product.deleteMany();
  });

  beforeEach(async () => {
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
  });

  it("should be able to get product detail successfully", async () => {
    const response = await supertest(app).get(`/api/v1/products/${productId.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully get product detail",
      data: {
        title: "Product A",
        description: "Description A",
        advantage: "Advantage A",
        mainFeature: "Main Feature A",
        mainPhoto: "product-a.jpg",
        secondPhoto: null,
        thirdPhoto: null,
      },
    });
  });

  it("should not be able to get product detail - invalid product id params", async () => {
    const response = await supertest(app).get("/api/v1/products/invalid-id");

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError");
  });
});
