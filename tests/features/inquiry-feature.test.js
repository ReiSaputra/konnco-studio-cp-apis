import { beforeAll, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import { prisma } from "../../src/database.js";
import app from "../../src/app.js";

describe("when users create inquiry or message contact", () => {
  beforeAll(async () => {
    await prisma.inquiry.deleteMany();
  });

  it("should be able to create inquiry successfully", async () => {
    const response = await supertest(app).post("/api/v1/inquiries").send({
      senderName: "Surya Firmansyah",
      email: "xL5d5@example.com",
      subject: "Subject A",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully created inquiry",
      data: {
        id: expect.any(String),
      },
    });
  });

  it("should not be able to create inquiry or message contact - invalid data", async () => {
    const response = await supertest(app).post("/api/v1/inquiries").send({
      senderName:
        "Surya Firmansyah lorem Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis",
      email: "suryafirmansyahgmail.com",
      subject: "Subject A",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });

  it("should not be able to create inquiry or message contact - not found properties", async () => {
    const response = await supertest(app).post("/api/v1/inquiries").send({});

    expect(response.status).toBe(400);
    console.info(response.body);
    expect(response.body).toEqual({
      message: expect.any(String),
      test: true,
    });
  });
});

describe("when users create inquiry or message contact", () => {
  beforeAll(async () => {
    await prisma.inquiry.deleteMany();
  });

  it("should be able to create and get the response 'thank you' from inquiry page successfully", async () => {
    const responseOne = await supertest(app).post("/api/v1/inquiries").send({
      senderName: "Ageng Wiryanto",
      email: "xL5d5@example.com",
      subject: "Subject A",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    });

    expect(responseOne.status).toBe(200);
    expect(responseOne.body).toEqual({
      message: "Successfully created inquiry",
      data: {
        id: expect.any(String),
      },
    });

    const inquiryId = responseOne.body.data.id;

    const responseTwo = await supertest(app).get(`/api/v1/inquiries/${inquiryId}/thank-you`);

    expect(responseTwo.status).toBe(200);
    expect(responseTwo.body).toEqual({
      message: "Successfully get response inquiry",
      data: {
        senderName: "Ageng Wiryanto",
      },
    });
  });

  it("should be able to create and but did not get the response 'thank you' from inquiry page successfully", async () => {
    const responseOne = await supertest(app).post("/api/v1/inquiries").send({
      senderName: "Ageng Wiryanto",
      email: "xL5d5@example.com",
      subject: "Subject A",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    });

    expect(responseOne.status).toBe(200);
    expect(responseOne.body).toEqual({
      message: "Successfully created inquiry",
      data: {
        id: expect.any(String),
      },
    });

    const responseTwo = await supertest(app).get(`/api/v1/inquiries/there-is-no-id/thank-you`);

    expect(responseTwo.status).toBe(400);
    expect(responseTwo.body).toEqual({
      message: "Inquiry not found",
      test: true,
    });
  });
});
