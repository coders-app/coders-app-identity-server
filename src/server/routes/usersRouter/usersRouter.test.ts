import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase";
import mongoose from "mongoose";
import app from "../../app.js";
import paths from "../paths.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import type { UserStructure } from "../../../database/models/User";
import User from "../../../database/models/User";

const { users, register } = paths;

const {
  successCodes: { createdCode },
  clientErrors: { conflictCode, badRequestCode },
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

  describe("When it receives a request with name 'Marta', email 'marta@isdicoders.com', password 'martita123' in the body but that user is already registered", () => {
    const existingUser = {
      name: "Marta",
      email: "marta@isdicoders.com",
      password: "martita123",
    };

    beforeEach(async () => {
      await User.create(existingUser);
    });

    test("Then it should respond with code 409 and 'Error creating a new user'", async () => {
      const expectedError = "Error creating a new user";

      const response = await request(app)
        .post(`${users}${register}`)
        .send(existingUser)
        .expect(conflictCode);

      expect(response.body).toHaveProperty("error", expectedError);
    });
  });

  describe("When it receives a request with name, email, password empty", () => {
    test("Then it should respond with status 400 and in the body 'Name shouldn't be empty, Password shouldn't be empty, Email shouldn't be empty'", async () => {
      const emptyUser: Partial<UserStructure> = {
        name: "",
        email: "",
        password: "",
      };
      const expectedMessage = [
        "Name shouldn't be empty",
        "Password shouldn't be empty",
        "Email shouldn't be empty",
      ].join("\n");

      const response = await request(app)
        .post(`${users}${register}`)
        .send(emptyUser)
        .expect(badRequestCode);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });

  describe("When it receives a request with name 'Luis', email 'luis.com' and password '12345'", () => {
    test("Then it should respond with status 400 and 'Password should have 8 characters minimum'", async () => {
      const newUser = {
        name: "Luis",
        email: "luis@isdicoder.com",
        password: "12345",
      };
      const expectedMessage = "Password should have 8 characters minimum";

      const response = await request(app)
        .post(`${users}${register}`)
        .send(newUser)
        .expect(badRequestCode);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
