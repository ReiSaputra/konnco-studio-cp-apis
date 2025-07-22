import { describe, expect, it } from "@jest/globals";
import app from "../../src/app.js";
import supertest from "supertest";

describe("when users access invalid routes on /api/v1/*", () => {
  it("should return 404 - GET", async () => {
    const response = await supertest(app).get("/api/v1/there-is-no-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual("Resource not found");
  });

  it("should return 404 - POST", async () => {
    const response = await supertest(app).post("/api/v1/there-is-no-route").send({
      senderName: "Ageng Wiryanto",
      email: "xL5d5@example.com",
      subject: "Subject A",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual("Resource not found");
  });

  it("should return 404 - PUT", async () => {
    const response = await supertest(app).put("/api/v1/there-is-no-route").send({
      senderName: "Ageng Wiryanto",
      email: "xL5d5@example.com",
      subject: "Subject A",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual("Resource not found");
  });

  it("should return 404 - PATCH", async () => {
    const response = await supertest(app).patch("/api/v1/there-is-no-route").send({
      senderName: "Ageng Wiryanto",
      email: "xL5d5@example.com",
      subject: "Subject A",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual("Resource not found");
  });

  it("should return 404 - DELETE", async () => {
    const response = await supertest(app).delete("/api/v1/there-is-no-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual("Resource not found");
  });
});

describe("when users access invalid routes on /*", () => {
  it("should return 404 - GET", async () => {
    const response = await supertest(app).get("/there-is-no-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual("Resource not found");
  });

  it("should return 404 - POST", async () => {
    const response = await supertest(app).post("/there-is-no-route").send({
      senderName: "Ageng Wiryanto",
      email: "xL5d5@example.com",
      subject: "Subject A",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual("Resource not found");
  });

  it("should return 404 - PUT", async () => {
    const response = await supertest(app).put("/there-is-no-route").send({
      senderName: "Ageng Wiryanto",
      email: "xL5d5@example.com",
      subject: "Subject A",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual("Resource not found");
  });

  it("should return 404 - PATCH", async () => {
    const response = await supertest(app).patch("/there-is-no-route").send({
      senderName: "Ageng Wiryanto",
      email: "xL5d5@example.com",
      subject: "Subject A",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual("Resource not found");
  });

  it("should return 404 - DELETE", async () => {
    const response = await supertest(app).delete("/there-is-no-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual("Resource not found");
  });
});
