import { afterAll, afterEach, beforeAll, beforeEach, describe, it } from "@jest/globals";
import supertest from "supertest";
import app from "../../../../src/app.js";
import { prisma } from "../../../../src/database.js";

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
    await prisma.admin.create({
      data: {
        name: "Admin A",
        email: "konnco@konnco.com",
        password: "dontknowityet",
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
    const loginResponse = await supertest(app).get("/api/v1/admins/auth/login").send({
      email: "konnco@konnco.com",
      password: "dontknowityet",
    });

    const response = await supertest(app).get("/api/v1/admins/admins/inquiries?page=1").set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    console.info(response.body);

    expect(response.status).toBe(200);
  });
});
