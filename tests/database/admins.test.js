import { beforeAll, describe, expect, it } from "@jest/globals";
import { prisma } from "../../src/database.js";

describe("Admin Database Unit Test", () => {
  beforeAll(async () => {
    await prisma.admin.deleteMany();
  });

  it("should be able to create admin successfully", async () => {
    const data = await prisma.admin.create({
      data: {
        name: "Salamet Santoso",
        password: "dontknowityet",
        email: "xL5d5@example.com",
      },
      select: {
        id: true,
        name: true,
      },
    });

    expect(data.id).toEqual(expect.any(String));
    expect(data.name).toBe("Salamet Santoso");
  });

  it("should be able to find admin successfully", async () => {
    const data = await prisma.admin.findUnique({
      where: {
        email: "xL5d5@example.com",
      },
      select: {
        id: true,
        name: true,
      },
    });

    expect(data.id).toEqual(expect.any(String));
    expect(data.name).toBe("Salamet Santoso");
  });

  it("should be able to find admin unsuccessfully", async () => {
    const data = await prisma.admin.findUnique({
      where: {
        email: "xL5d4@example.com",
      },
      select: {
        id: true,
        name: true,
      },
    });

    expect(data).toBeNull();
  });
});
