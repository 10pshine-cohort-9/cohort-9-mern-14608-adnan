import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Note from "../src/models/Note.js";

describe("Notes API", () => {
  let agent: ReturnType<typeof request.agent>;

  before(async () => {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI as string);
      }
    } catch (err) {
      throw err;
    }
  });

  beforeEach(async () => {
    try {
      agent = request.agent(app);
      await agent.post("/api/auth/register").send({
        name: "Notes User",
        email: "notes@example.com",
        password: "password123",
      });
    } catch (err) {
      throw err;
    }
  });

  afterEach(async () => {
    try {
      const testUsers = await User.find({ email: { $regex: /@example\.com$/ } }, "_id");
      const testUserIds = testUsers.map((u) => u._id);
      await Note.deleteMany({ user: { $in: testUserIds } });
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

  it("creates a note for the authenticated user", async () => {
    const res = await agent.post("/api/notes").send({ title: "First note", content: "hello" });
    expect(res.status).to.equal(201);
    expect(res.body.data).to.have.property("title", "First note");
  });

  it("only returns notes belonging to the user", async () => {
    await agent.post("/api/notes").send({ title: "Mine", content: "x" });
    const res = await agent.get("/api/notes");
    expect(res.status).to.equal(200);
    expect(res.body.data).to.have.lengthOf(1);
  });

  it("returns 404 for a note that does not belong to the user", async () => {
    const created = await agent.post("/api/notes").send({ title: "Mine", content: "x" });
    const otherAgent = request.agent(app);
    await otherAgent.post("/api/auth/register").send({
      name: "Other User",
      email: "other@example.com",
      password: "password123",
    });
    const res = await otherAgent.get(`/api/notes/${created.body.data._id}`);
    expect(res.status).to.equal(404);
  });
});
