import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase";
import mongoose from "mongoose";
import app from "../../app.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
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
import config from "../../../config";
import {
  mockToken,
  mockTokenPayload,
} from "../../../testUtils/mocks/mockToken";
import appAuthenticationNames from "../../../constants/appAuthenticationNames";
import { environment } from "../../../loadEnvironments";

jest.mock("../../../email/sendEmail/sendEmail.js");

const { apiGatewayKey } = environment;

const { apiKeyHeader, apiNameHeader, apiGateway } = appAuthenticationNames;

const {
  singleSignOnCookie: { cookieName },
} = config;

const correctCookie = `${cookieName}=${mockToken}`;
const incorrectCookie = `${cookieName}=incorrect-cookie`;

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

  describe("When it receives a request with name 'Luis', email 'luisito@isdicoders.com' and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 201 and the user's credentials in the body", async () => {
      const newUser = getMockUserData({ name: luisName, email: luisEmail });

      const response: { body: { user: UserStructure } } = await request(app)
        .post(paths.users.register)
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .send(newUser)
        .expect(createdCode);

      const {
        user: { name, email },
      } = response.body;

      expect(name).toBe(newUser.name);
      expect(email).toBe(newUser.email);
    });
  });

  describe("When it receives a request with email 'marta@isdicoders.com' and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    const existingUser = getMockUserData({ email: martaEmail });

    beforeEach(async () => {
      await User.create(existingUser);
    });

    test("Then it should respond with code 409 and 'User already exists'", async () => {
      const expectedError = "User already exists";

      const response = await request(app)
        .post(paths.users.register)
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .send(existingUser)
        .expect(conflictCode);

      expect(response.body).toHaveProperty("error", expectedError);
    });
  });

  describe("When it receives a request with an empty name and empty email and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
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
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .send(emptyUser)
        .expect(badRequestCode);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });

  describe("When it receives a request with name 'Luis', email 'luisito@isdicoders.com' and an incorrect api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 401 and the error 'Invalid API Key'", async () => {
      const newUser = getMockUserData({ name: luisName, email: luisEmail });
      const incorrectApiGatewayKey = "incorrect key";
      const expectedErrorMessage = "Invalid API Key";

      const response: { body: { error: string } } = await request(app)
        .post(paths.users.register)
        .set(apiKeyHeader, incorrectApiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .send(newUser)
        .expect(unauthorizedCode);

      const { error } = response.body;

      expect(error).toBe(expectedErrorMessage);
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

  describe("When it receives a request with email 'luisito@isdicoders.com', a correct password and the user is registered and active and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 200 and a Set-cookie header with a token", async () => {
      const { email, password, name } = luisitoUser;

      const response = await request(app)
        .post(paths.users.login)
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
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

  describe("When it receives a request with email 'luisito@isdicoders.com' and incorrect password 'luisito1' and the user is registered and active and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with error 'Incorrect email or password'", async () => {
      const { email } = luisitoUser;
      const incorrectPassword = "luisito1";

      const response = await request(app)
        .post(paths.users.login)
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .send({ email, password: incorrectPassword })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(wrongCredentialsError);
    });
  });

  describe("When it receives a request with email 'martita@isdicoders.com' a password, and the user exists but is inactive and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 401 and message 'User is inactive, contact your administrator if you think this is a mistake'", async () => {
      const { email, password } = martitaUser;
      const inactiveUserError = {
        error:
          "User is inactive, contact your administrator if you think this is a mistake",
      };

      const response = await request(app)
        .post(paths.users.login)
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .send({ email, password })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(inactiveUserError);
    });
  });

  describe("When it receives a request with invalid email 'luisito' and short password 'luisito' and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 400 and the errors 'Email must be a valid email'", async () => {
      const expectedErrors = {
        error: ["Email must be a valid email"].join(" & "),
      };
      const email = "luisito";
      const password = "luisito";

      const response = await request(app)
        .post(paths.users.login)
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
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

  describe("When it receives query string activationKey and password & confirmPassword 'luisito123' and the activation key is correct and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 200 and message 'User account has been activated'", async () => {
      const expectedMessage = {
        message: "User account has been activated",
      };

      const response = await request(app)
        .post(`${paths.users.activate}?activationKey=${luisitoId}`)
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .send(activationBody)
        .expect(okCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives query string activationKey and it is invalid and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 401 'Invalid activation key'", async () => {
      const invalidActivationKey = new mongoose.Types.ObjectId().toString();
      const expectedMessage = {
        error: "Invalid activation key",
      };

      const response = await request(app)
        .post(`${paths.users.activate}?activationKey=${invalidActivationKey}`)
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .send(activationBody)
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives query string activationKey with correct ID but the stored hash has expired and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
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
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .send(activationBody)
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives query string activationKey, and in the body password 'luisito123' and confirmPassword 'luisito1234' and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 400 and message 'Passwords must match'", async () => {
      const activationKey = new mongoose.Types.ObjectId().toString();
      const expectedMessage = { error: "Passwords must match" };
      const activationBody: UserActivationCredentials = {
        password: "luisito123",
        confirmPassword: "luisito1234",
      };

      const response = await request(app)
        .post(`${paths.users.activate}?activationKey=${activationKey}`)
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .send(activationBody)
        .expect(badRequestCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });
});

describe("Given a GET /verify-token endpoint", () => {
  const expectedMessage = "Unauthorized";

  describe("When it receives a request with no cookie and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 401 and 'Unauthorized' error message ", async () => {
      const expectedStatus = unauthorizedCode;

      const response: {
        body: { userPayload: CustomTokenPayload };
      } = await request(app)
        .get(paths.users.verifyToken)
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });

  describe("When it receives a request with a cookie and a valid token and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 200 and userPayload in the body", async () => {
      const expectedStatus = okCode;

      const response: {
        body: { userPayload: CustomTokenPayload };
      } = await request(app)
        .get(paths.users.verifyToken)
        .set("Cookie", [correctCookie])
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .send(mockTokenPayload)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("userPayload", mockTokenPayload);
    });
  });

  describe("When it receives a request with auth header and an invalid token and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 401 and error message 'Unauthorized'", async () => {
      const expectedStatus = unauthorizedCode;

      const response: {
        body: { userPayload: CustomTokenPayload };
      } = await request(app)
        .get(paths.users.verifyToken)
        .set("Cookie", [incorrectCookie])
        .set(apiKeyHeader, apiGatewayKey)
        .set(apiNameHeader, apiGateway)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
