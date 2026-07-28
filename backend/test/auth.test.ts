import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("Auth API", () => {
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
      // Only ever delete accounts this test suite itself created — never a blanket wipe
      await User.deleteMany({ email: { $regex: /@example\.com$/ } });
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
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).to.equal(201);
    expect(res.body.data).to.have.property("email", "test@example.com");
    expect(res.body.data).to.not.have.property("password");
  });

  it("rejects duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "dup@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/register").send({
      name: "Another",
      email: "dup@example.com",
      password: "password123",
    });
    expect(res.status).to.equal(409);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });
    expect(res.status).to.equal(200);
    expect(res.headers["set-cookie"]).to.exist;
  });

  it("rejects wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "wrong@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@example.com",
      password: "wrongpass",
    });
    expect(res.status).to.equal(401);
  });
});
