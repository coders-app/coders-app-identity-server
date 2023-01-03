import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase";
import mongoose from "mongoose";
import app from "../../app.js";
import paths from "../paths.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import User from "../../../database/models/User.js";
import type { CustomTokenPayload } from "../../controllers/userControllers/types";
import {
  luisEmail,
  luisName,
  martaEmail,
} from "../../../testUtils/mocks/mockUsers";
import type { UserData, UserStructure } from "../../../types/types";
import { getMockUserData } from "../../../factories/userDataFactory";
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

  describe("When it receives a request with name 'Luis', email 'luisito@isdicoders.com'", () => {
    test("Then it should respond with status 201 and the user's credentials in the body", async () => {
      const newUser = getMockUserData({ name: luisName, email: luisEmail });

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

  describe("When it receives a request with email 'marta@isdicoders.com'", () => {
    const existingUser = getMockUserData({ email: martaEmail });

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

  describe("When it receives a request with an empty name and empty email", () => {
    test("Then it should respond with status 400 and in the body 'Name shouldn't be empty, Email shouldn't be empty'", async () => {
      const emptyUser: UserData = {
        name: "",
        email: "",
      };
      const expectedMessage = [
        "Name shouldn't be empty",
        "Email shouldn't be empty",
      ].join("\n");

      const response = await request(app)
        .post(`${users}${register}`)
        .send(emptyUser)
        .expect(badRequestCode);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});

describe("Given a POST /users/login endpoint", () => {
  const wrongCredentialsError = { error: "Incorrect email or password" };

  const luisitoData = getMockUserData({ email: luisEmail });
  let luisitoId: mongoose.Types.ObjectId;

  const martitaData = getMockUserData({ email: martaEmail });

  beforeAll(async () => {
    const luisitoHashedPassword = await bcrypt.hash(luisitoData.password, 10);

    const martitaHashedPassword = await bcrypt.hash(martitaData.password, 10);

    const luisito = await User.create({
      ...luisitoData,
      password: luisitoHashedPassword,
      isActive: true,
    });

    luisitoId = luisito._id;

    await User.create({
      ...martitaData,
      password: martitaHashedPassword,
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com', a correct password and the user is registered and active", () => {
    test("Then it should respond with status 200 and a token", async () => {
      const { email, password, name } = luisitoData;

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

  describe("When it receives a request with email 'luisito@isdicoders.com' and incorrect password 'luisito1' and the user is registered and active", () => {
    test("Then it should respond with error 'Incorrect email or password'", async () => {
      const { email } = luisitoData;
      const incorrectPassword = "luisito1";

      const response = await request(app)
        .post(`${users}${login}`)
        .send({ email, password: incorrectPassword })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(wrongCredentialsError);
    });
  });

  describe("When it receives a request with email 'martita@isdicoders.com' a password, and the user exists but is inactive", () => {
    test("Then it should respond with status 401 and message 'User is inactive, contact your administrator if you think this is a mistake'", async () => {
      const { email, password } = martitaData;
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

  describe("When it receives a request with invalid email 'luisito' and short password 'luisito'", () => {
    test("Then it should respond with status 400 and the errors 'Email must be a valid email' and 'Password should have 8 characters minimum'", async () => {
      const expectedErrors = {
        error: [
          '"Email" must be a valid email',
          "Password should have 8 characters minimum",
        ].join("\n"),
      };
      const email = "luisito";
      const password = "luisito";

      const response = await request(app)
        .post(`${users}${login}`)
        .send({ email, password })
        .expect(badRequestCode);

      expect(response.body).toStrictEqual(expectedErrors);
    });
  });
});
