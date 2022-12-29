import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase";
import mongoose from "mongoose";
import app from "../../app.js";
import paths from "../paths.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import type { UserStructure } from "../../../database/models/User";
import User from "../../../database/models/User";
import {
  getMockUser,
  getMockUserCredentials,
} from "../../../factories/usersFactory";
import type { CustomTokenPayload } from "../../controllers/userControllers/types";

const { users, register, login } = paths;

const {
  successCodes: { createdCode, okCode },
  clientErrors: { conflictCode, badRequestCode, unauthorizedCode },
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
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("When it receives a request with a name, email and password in the body", () => {
    test("Then it should respond with status 201 and the user's credentials in the body", async () => {
      const newUser = getMockUserCredentials();

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

  describe("When it receives a request with a name, email and password in the body, but that user is already registered", () => {
    const existingUser = getMockUserCredentials();

    beforeEach(async () => {
      await User.create(existingUser);
    });

    test("Then it should respond with code 409 and 'User already exists'", async () => {
      const expectedError = "User already exists";

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

  describe("When it receives a request with a name, email and password '12345'", () => {
    test("Then it should respond with status 400 and 'Password should have 8 characters minimum'", async () => {
      const newUser = getMockUserCredentials({ password: "12345" });
      const expectedMessage = "Password should have 8 characters minimum";

      const response = await request(app)
        .post(`${users}${register}`)
        .send(newUser)
        .expect(badRequestCode);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});

describe("Given a POST /users/login endpoint", () => {
  const wrongCredentialsError = { error: "Incorrect email or password" };

  const luisitoCredentials = getMockUser({
    email: "luisito@isdicoders.com",
    password: "luisito123",
    isActive: true,
  });
  let luisitoId: mongoose.Types.ObjectId;

  const martitaCredentials = getMockUser({
    email: "martita@isdicoders.com",
    password: "martita123",
  });

  beforeAll(async () => {
    const luisitoHashedPassword = await bcrypt.hash(
      luisitoCredentials.password,
      10
    );

    const martitaHashedPassword = await bcrypt.hash(
      martitaCredentials.password,
      10
    );

    const luisito = await User.create({
      ...luisitoCredentials,
      password: luisitoHashedPassword,
    });

    luisitoId = luisito._id;

    await User.create({
      ...martitaCredentials,
      password: martitaHashedPassword,
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com' and correct password 'luisito123' and the user is registered and active", () => {
    test("Then it should respond with status 200 and a token", async () => {
      const { email, password, name } = luisitoCredentials;

      const response = await request(app)
        .post(`${users}${login}`)
        .send({ email, password })
        .expect(okCode);

      expect(response.body).toHaveProperty("token");

      const { token } = response.body as { token: string };

      const tokenPayload = jwt.decode(token);

      expect(tokenPayload as CustomTokenPayload).toHaveProperty(
        "id",
        luisitoId.toString()
      );

      expect(tokenPayload as CustomTokenPayload).toHaveProperty("name", name);
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com' and incorrect password 'luisito' and the user is registered and active", () => {
    test("Then it should respond with status 200 and a token", async () => {
      const { email } = luisitoCredentials;
      const incorrectPassword = "luisito";

      const response = await request(app)
        .post(`${users}${login}`)
        .send({ email, password: incorrectPassword })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(wrongCredentialsError);
    });
  });

  describe("When it receives a request with incorrect email 'luisito123@isdicoders.com' and correct password 'luisito' and the user is registered and active", () => {
    test("Then it should respond with status 200 and a token", async () => {
      const { password } = luisitoCredentials;
      const incorrectEmail = "luisito123@isdicoders.com";

      const response = await request(app)
        .post(`${users}${login}`)
        .send({ email: incorrectEmail, password })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(wrongCredentialsError);
    });
  });

  describe("When it receives a request with email 'martita@isdicoders.com' and password 'martita123' and the user exists but is inactive", () => {
    test("Then it should respond with status 401 and message 'User is inactive, contact your administrator if you think this is a mistake'", async () => {
      const { email, password } = martitaCredentials;
      const inactiveUserError = {
        error:
          "User is inactive, contact your administrator if you think this is a mistake",
      };

      const response = await request(app)
        .post(`${users}${login}`)
        .send({ email, password })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(inactiveUserError);
    });
  });
});
