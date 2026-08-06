import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("Auth API", () => {
  const createdEmails: string[] = [];

  const uniqueEmail = (label: string): string => {
    const email = `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
    createdEmails.push(email);
    return email;
  };

  before(async () => {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI as string);
      }
    } catch (err) {
      throw err;
    }
  });

  afterEach(async () => {
    try {
      if (createdEmails.length > 0) {
        await User.deleteMany({ email: { $in: createdEmails } });
        createdEmails.length = 0;
      }
    } catch (err) {
      throw err;
    }
  });

  after(async () => {
    try {
      await mongoose.connection.close();
    } catch (err) {
      throw err;
    }
  });

  it("registers a new user", async () => {
    const email = uniqueEmail("test");
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email,
      password: "password123",
    });
    expect(res.status).to.equal(201);
    expect(res.body.data).to.have.property("email", email);
    expect(res.body.data).to.not.have.property("password");
  });

  it("rejects duplicate email", async () => {
    const email = uniqueEmail("dup");
    await request(app).post("/api/auth/register").send({ name: "Test User", email, password: "password123" });
    const res = await request(app).post("/api/auth/register").send({ name: "Another", email, password: "password123" });
    expect(res.status).to.equal(409);
  });

  it("logs in with correct credentials", async () => {
    const email = uniqueEmail("login");
    await request(app).post("/api/auth/register").send({ name: "Login User", email, password: "password123" });
    const res = await request(app).post("/api/auth/login").send({ email, password: "password123" });
    expect(res.status).to.equal(200);
    expect(res.headers["set-cookie"]).to.exist;
  });

  it("rejects wrong password", async () => {
    const email = uniqueEmail("wrong");
    await request(app).post("/api/auth/register").send({ name: "Login User", email, password: "password123" });
    const res = await request(app).post("/api/auth/login").send({ email, password: "wrongpass" });
    expect(res.status).to.equal(401);
  });
});
