import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase";
import mongoose from "mongoose";
import app from "../../app.js";
import paths from "../paths.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import type { UserStructure } from "../../../database/models/User";

const { users, register } = paths;

const {
  successCodes: { createdCode },
} = httpStatusCodes;

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given a POST /users/register endpoint", () => {
  describe("When it receives a request with name 'Luis', email 'luis@isdicoders.com' and password 'luisito123' in the body", () => {
    test("Then it should respond with status 201 and the user's credentials in the body", async () => {
      const newUser = {
        name: "Luis",
        email: "luis@isdicoders.com",
        password: "luisito123",
      };

      const response: { body: { user: UserStructure } } = await request(app)
        .post(`${users}${register}`)
        .send(newUser)
        .expect(createdCode);

      const {
        user: { name, email },
      } = response.body;

      expect(name).toBe(newUser.name);
      expect(email).toBe(newUser.email);
    });
  });
});
