import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import app from "../../../../src/app.js";
import { prisma } from "../../../../src/database.js";
import bcrypt from "bcrypt";

describe("when admin want to get inquiries data in route GET /api/v1/admins/inquiries", () => {
  beforeAll(async () => {
    await prisma.inquiry.deleteMany();
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
        name: "Admin A",
        email: "konnco@konnco.com",
        password: hash,
        phoneNumber: "087843202523",
        role: "ADMIN",
        permissions: {
          create: {
            canShowInquiry: true,
            canViewInquiry: true,
            canDeleteInquiry: true,
          },
        },
      },
    });

    await prisma.inquiry.createMany({
      data: [
        {
          senderName: "Surya Firmansyah",
          subject: "Subject A",
          email: "tDx5T@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Ageng Wiryanto",
          subject: "Subject B",
          email: "xL5d5@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Nurul Fikri",
          subject: "Subject C",
          email: "x45d5@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Rizky Saputra",
          subject: "Subject D",
          email: "rizky98@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Intan Permata",
          subject: "Subject E",
          email: "intan_p@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Bayu Nugroho",
          subject: "Subject F",
          email: "bayu123@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Sari Dewi",
          subject: "Subject G",
          email: "sari.dewi@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Adi Kurniawan",
          subject: "Subject H",
          email: "adi.k@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Melati Ayu",
          subject: "Subject I",
          email: "melati.ayu@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Dian Pratama",
          subject: "Subject J",
          email: "dianp@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Teguh Hidayat",
          subject: "Subject K",
          email: "teguh.h@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Lestari Ningsih",
          subject: "Subject L",
          email: "lestari.n@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Fajar Maulana",
          subject: "Subject M",
          email: "fajarma@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Wulan Sari",
          subject: "Subject N",
          email: "wulansari@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Gilang Ramadhan",
          subject: "Subject O",
          email: "gilang.r@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Citra Ayuningtyas",
          subject: "Subject P",
          email: "citra.a@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Hendra Wijaya",
          subject: "Subject Q",
          email: "hendra.w@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Nina Amelia",
          subject: "Subject R",
          email: "nina.am@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Farhan Akbar",
          subject: "Subject S",
          email: "farhan.a@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Putri Lestari",
          subject: "Subject T",
          email: "putri.l@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Bagus Santoso",
          subject: "Subject U",
          email: "bagus.s@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Yulia Hartati",
          subject: "Subject V",
          email: "yulia.h@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Rendy Prakoso",
          subject: "Subject W",
          email: "rendy.p@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Rina Anggraini",
          subject: "Subject X",
          email: "rina.a@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Dede Kurnia",
          subject: "Subject Y",
          email: "dede.k@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Naufal Rizqi",
          subject: "Subject Z",
          email: "naufal.r@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Tania Wulandari",
          subject: "Subject AA",
          email: "tania.w@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Ilham Prasetyo",
          subject: "Subject AB",
          email: "ilham.p@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Mega Sari",
          subject: "Subject AC",
          email: "mega.s@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Yoga Firmansyah",
          subject: "Subject AD",
          email: "yoga.f@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
        {
          senderName: "Sarah Rahmawati",
          subject: "Subject AE",
          email: "sarah.r@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        },
      ],
    });
  });

  afterEach(async () => {
    await prisma.inquiry.deleteMany();
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  afterAll(async () => {
    await prisma.inquiry.deleteMany();
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should be able to get inquiries data successfully", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/inquiries?page=1").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    const responsePage2 = await supertest(app).get("/api/v1/admins/inquiries?page=2").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    const responsePage3 = await supertest(app).get("/api/v1/admins/inquiries?page=3").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    const responsePage4 = await supertest(app).get("/api/v1/admins/inquiries?page=4").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(10);

    expect(responsePage2.status).toBe(200);
    expect(responsePage2.body.data).toHaveLength(10);

    expect(responsePage3.status).toBe(200);
    expect(responsePage3.body.data).toHaveLength(10);

    expect(responsePage4.status).toBe(200);
    expect(responsePage4.body.data).toHaveLength(1);
  });

  it("should be able to get inquiries data successfully - search by senderName", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/inquiries?search=Yulia").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it("should be able to get inquiries data successfully - use startDate and endDate", async () => {
    await prisma.inquiry.createMany({
      data: [
        {
          senderName: "Yulia Wulandari",
          subject: "Subject AA",
          email: "naufal.r@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
          createdAt: new Date("2022-01-01"),
        },
        {
          senderName: "Yulia Wulandari",
          subject: "Subject AB",
          email: "tania.w@example.com",
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
          createdAt: new Date("2022-01-25"),
        },
      ],
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/inquiries?startDate=2022-01-01&endDate=2022-01-31").set("Authorization", `Bearer ${loginResponse.body.data.token}`);
    const response2 = await supertest(app).get("/api/v1/admins/inquiries?startDate=2022-01-01&endDate=2022-01-10").set("Authorization", `Bearer ${loginResponse.body.data.token}`);
    const response3 = await supertest(app).get("/api/v1/admins/inquiries?startDate=2021-01-01&endDate=2021-01-10").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);

    expect(response.status).toBe(200);
    expect(response2.body.data).toHaveLength(1);

    expect(response3.status).toBe(200);
    expect(response3.body.data).toHaveLength(0);
  });

  it("should be able to get inquiries data successfully but did not change the filter request - use just startEnd", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/inquiries?startDate=2022-01-01").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(10);
  });

  it("should not be able to get inquiries data successfully - startDate is right format but endDate is wrong", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get(`/api/v1/admins/inquiries?startDate=2022-01-01&endDate=invalid`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ValidationError:");
  });

  it("should not be able to get inquiries data successfully - no authorized", async () => {
    const response = await supertest(app).get("/api/v1/admins/inquiries");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("TokenError: Unauthorized");
  });

  it("should not be able to get inquiries data successfully - no permission", async () => {
    await prisma.admin.update({
      where: {
        email: "konnco@konnco.com",
      },
      data: {
        permissions: {
          update: {
            canShowInquiry: false,
          },
        },
      },
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/inquiries?page=1").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: You don't have permission to show admin inquiries");
  });
});

describe("when admin want to get inquiries data in route GET /api/v1/admins/inquiries/:inquiryId", () => {
  beforeAll(async () => {
    await prisma.inquiry.deleteMany();
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  let inquiryId = null;

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);

    await prisma.admin.create({
      data: {
        name: "Admin A",
        phoneNumber: "087843202523",
        role: "ADMIN",
        email: "konnco@konnco.com",
        password: hash,
        permissions: {
          create: {
            canShowInquiry: true,
            canViewInquiry: true,
            canDeleteInquiry: true,
          },
        },
      },
    });

    inquiryId = await prisma.inquiry.create({
      data: {
        senderName: "Surya Firmansyah",
        email: "xL5d5@example.com",
        subject: "Subject A",
        message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
      },
      select: {
        id: true,
      },
    });
  });

  afterEach(async () => {
    await prisma.inquiry.deleteMany();
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  afterAll(async () => {
    await prisma.inquiry.deleteMany();
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should be able to get inquiry detail data successfully", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get(`/api/v1/admins/inquiries/${inquiryId.id}`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.senderName).toBe("Surya Firmansyah");
  });

  it("should not be able to get inquiry detail data successfully - no authorized", async () => {
    const response = await supertest(app).get(`/api/v1/admins/inquiries/${inquiryId.id}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("TokenError: Unauthorized");
  });

  it("should not be able to get inquiry detail data successfully - no permission", async () => {
    await prisma.admin.update({
      where: {
        email: "konnco@konnco.com",
      },
      data: {
        permissions: {
          update: {
            canViewInquiry: false,
          },
        },
      },
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get(`/api/v1/admins/inquiries/${inquiryId.id}`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: You don't have permission to view admin inquiries");
  });

  it("should not be able to get inquiry detail data successfully- inquiry not found", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app)
      .get(`/api/v1/admins/inquiries/${inquiryId.id + 1}`)
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: Inquiry not found");
  });

  it("should not be able to get inquiry detail data successfully - string validation inquiryId", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get(`/api/v1/admins/inquiries/asparagus`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Error: Inquiry not found");
  });

  it("should not be able to get inquiry detail data successfully - number validation inquiryId", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get(`/api/v1/admins/inquiries/0`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Error: Inquiry not found");
  });
});

describe("when admin want to delete data in route DELETE /api/v1/admins/inquiries/:inquiryId", () => {
  beforeAll(async () => {
    await prisma.inquiry.deleteMany();
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  let inquiryId = null;

  beforeEach(async () => {
    const hash = await bcrypt.hash("dontknowityet", 10);

    await prisma.admin.create({
      data: {
        name: "Admin A",
        phoneNumber: "087843202523",
        role: "ADMIN",
        email: "konnco@konnco.com",
        password: hash,
        permissions: {
          create: {
            canShowInquiry: true,
            canViewInquiry: true,
            canDeleteInquiry: true,
          },
        },
      },
    });

    inquiryId = await prisma.inquiry.create({
      data: {
        senderName: "Surya Firmansyah",
        email: "xL5d5@example.com",
        subject: "Subject A",
        message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
      },
      select: {
        id: true,
      },
    });
  });

  afterEach(async () => {
    await prisma.inquiry.deleteMany();
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  afterAll(async () => {
    await prisma.inquiry.deleteMany();
    await prisma.blog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.adminPermission.deleteMany();
    await prisma.admin.deleteMany();
  });

  it("should be able to delete inquiry data successfully", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).delete(`/api/v1/admins/inquiries/${inquiryId.id}`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully delete admin inquiry detail");
  });

  it("should not be able to delete inquiry data successfully - no authorized", async () => {
    const response = await supertest(app).delete(`/api/v1/admins/inquiries/${inquiryId.id}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("TokenError: Unauthorized");
  });

  it("should not be able to delete inquiry data successfully - no permission", async () => {
    await prisma.admin.update({
      where: {
        email: "konnco@konnco.com",
      },
      data: {
        permissions: {
          update: {
            canDeleteInquiry: false,
          },
        },
      },
    });

    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).delete(`/api/v1/admins/inquiries/${inquiryId.id}`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: You don't have permission to delete admin inquiries");
  });

  it("should not be able to delete inquiry data successfully - inquiry not found", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).delete(`/api/v1/admins/inquiries/0`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error: Inquiry not found");
  });

  it("should not be able to delete inquiry data successfully - string validation inquiryId", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).delete(`/api/v1/admins/inquiries/invalid-inquiry-id`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Error: Inquiry not found");
  });

  it("should not be able to delete inquiry data successfully - number validation inquiryId", async () => {
    const loginResponse = await supertest(app).post("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).delete(`/api/v1/admins/inquiries/invalid-inquiry-id`).set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Error: Inquiry not found");
  });
});
