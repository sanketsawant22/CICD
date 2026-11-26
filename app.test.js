import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "./app.js";

describe("Express API tests", () => {
  it("should return welcome message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Welcome to the User API");
  });

  it("should return 404 for an unknown route", async () => {
    const response = await request(app).get("/unknown");

    expect(response.status).toBe(404);
  });
});
