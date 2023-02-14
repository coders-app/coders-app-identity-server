import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase";
import mongoose from "mongoose";
import app from "../../app.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import User from "../../../database/models/User.js";
import type {
  CustomTokenPayload,
  UserActivationCredentials,
  UserData,
  UserStructure,
} from "../../types";
import {
  luisEmail,
  luisName,
  martaEmail,
} from "../../../testUtils/mocks/mockUsers";
import { getMockUserData } from "../../../factories/userDataFactory";
import { getMockUser } from "../../../factories/userFactory";
import cookieParser from "../../../testUtils/cookieParser";
import { paths } from "../paths";

jest.mock("../../../email/sendEmail/sendEmail.js");

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
        .post(paths.users.register)
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
        .post(paths.users.register)
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
      ].join(" & ");

      const response = await request(app)
        .post(paths.users.register)
        .send(emptyUser)
        .expect(badRequestCode);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});

describe("Given a POST /users/login endpoint", () => {
  const wrongCredentialsError = { error: "Incorrect email or password" };

  const luisitoUser = getMockUser({ email: luisEmail });
  let luisitoId: mongoose.Types.ObjectId;

  const martitaUser = getMockUser({ email: martaEmail });

  beforeAll(async () => {
    const luisitoHashedPassword = await bcrypt.hash(luisitoUser.password, 10);

    const martitaHashedPassword = await bcrypt.hash(martitaUser.password, 10);

    const luisito = await User.create({
      ...luisitoUser,
      password: luisitoHashedPassword,
      isActive: true,
    });

    luisitoId = luisito._id;

    await User.create({
      ...martitaUser,
      password: martitaHashedPassword,
    });
  });

  afterAll(async () => {
    await User.deleteMany();
  });

  describe("When it receives a request with email 'luisito@isdicoders.com', a correct password and the user is registered and active", () => {
    test("Then it should respond with status 200 and a token", async () => {
      const { email, password, name } = luisitoUser;

      const response = await request(app)
        .post(paths.users.login)
        .send({ email, password })
        .expect(okCode);

      expect(response.body).toHaveProperty("message");

      const { message } = response.body as { message: string };
      const [identityCookie] = response.get("Set-Cookie");
      const parsedCookie = cookieParser(identityCookie);
      const token = parsedCookie.coders_identity_token;
      const tokenPayload = jwt.decode(token as string);

      expect(message).toBe("coders_identity_token has been set");
      expect(tokenPayload as CustomTokenPayload).toHaveProperty(
        "id",
        luisitoId.toString()
      );
      expect(tokenPayload as CustomTokenPayload).toHaveProperty("name", name);
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com' and incorrect password 'luisito1' and the user is registered and active", () => {
    test("Then it should respond with error 'Incorrect email or password'", async () => {
      const { email } = luisitoUser;
      const incorrectPassword = "luisito1";

      const response = await request(app)
        .post(paths.users.login)
        .send({ email, password: incorrectPassword })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(wrongCredentialsError);
    });
  });

  describe("When it receives a request with email 'martita@isdicoders.com' a password, and the user exists but is inactive", () => {
    test("Then it should respond with status 401 and message 'User is inactive, contact your administrator if you think this is a mistake'", async () => {
      const { email, password } = martitaUser;
      const inactiveUserError = {
        error:
          "User is inactive, contact your administrator if you think this is a mistake",
      };

      const response = await request(app)
        .post(paths.users.login)
        .send({ email, password })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(inactiveUserError);
    });
  });

  describe("When it receives a request with invalid email 'luisito' and short password 'luisito'", () => {
    test("Then it should respond with status 400 and the errors 'Email must be a valid email'", async () => {
      const expectedErrors = {
        error: ["Email must be a valid email"].join(" & "),
      };
      const email = "luisito";
      const password = "luisito";

      const response = await request(app)
        .post(paths.users.login)
        .send({ email, password })
        .expect(badRequestCode);

      expect(response.body).toStrictEqual(expectedErrors);
    });
  });
});

describe("Given a POST /users/activate endpoint", () => {
  const luisitoPassword = "luisito123";
  let luisitoId: string;
  const activationBody = {
    password: luisitoPassword,
    confirmPassword: luisitoPassword,
  };

  beforeEach(async () => {
    const luisitoData = getMockUserData({ email: luisEmail });
    const luisitoUser = await User.create({
      ...luisitoData,
    });

    luisitoId = luisitoUser._id.toString();
    luisitoUser.activationKey = await bcrypt.hash(luisitoId, 10);

    await luisitoUser.save();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  describe("When it receives query string activationKey and password & confirmPassword 'luisito123' and the activation key is correct", () => {
    test("Then it should respond with status 200 and message 'User account has been activated'", async () => {
      const expectedMessage = {
        message: "User account has been activated",
      };

      const response = await request(app)
        .post(`${paths.users.activate}?activationKey=${luisitoId}`)
        .send(activationBody)
        .expect(okCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives query string activationKey and it is invalid", () => {
    test("Then it should respond with status 401 'Invalid activation key'", async () => {
      const invalidActivationKey = new mongoose.Types.ObjectId().toString();
      const expectedMessage = {
        error: "Invalid activation key",
      };

      const response = await request(app)
        .post(`${paths.users.activate}?activationKey=${invalidActivationKey}`)
        .send(activationBody)
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives query string activationKey with correct ID but the stored hash has expired", () => {
    const martitaPassword = "martita123";
    let martitaId: string;
    const activationBody = {
      password: martitaPassword,
      confirmPassword: martitaPassword,
    };

    beforeEach(async () => {
      const martitaData = getMockUserData({ email: martaEmail });
      const martitaUser = await User.create({
        ...martitaData,
      });

      martitaId = martitaUser._id.toString();

      await martitaUser.save();
    });

    test("Then it should respond with status 401 and message 'Invalid activation key'", async () => {
      const expectedMessage = {
        error: "Invalid activation key",
      };

      const response = await request(app)
        .post(`${paths.users.activate}?activationKey=${martitaId}`)
        .send(activationBody)
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives query string activationKey, and in the body password 'luisito123' and confirmPassword 'luisito1234'", () => {
    test("Then it should respond with status 400 and message 'Passwords must match'", async () => {
      const activationKey = new mongoose.Types.ObjectId().toString();
      const expectedMessage = { error: "Passwords must match" };
      const activationBody: UserActivationCredentials = {
        password: "luisito123",
        confirmPassword: "luisito1234",
      };

      const response = await request(app)
        .post(`${paths.users.activate}?activationKey=${activationKey}`)
        .send(activationBody)
        .expect(badRequestCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });
});
