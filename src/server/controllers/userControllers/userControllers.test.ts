import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import User from "../../../database/models/User.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import { loginUser, registerUser } from "./userControllers.js";
import CustomError from "../../../CustomError/CustomError.js";
import { getMockToken } from "../../../testUtils/mocks/mockToken.js";
import { luisEmail } from "../../../testUtils/mocks/mockUsers.js";
import type { UserWithId } from "../../../types/types.js";
import { getMockUserData } from "../../../factories/userDataFactory.js";
import { getMockUser } from "../../../factories/userFactory.js";
import { getMockUserCredentials } from "../../../factories/userCredentialsFactory.js";
import singleSignOnCookie from "../../../utils/singleSignOnCookie.js";

jest.mock("../../email/sendEmail/sendEmail.js");

const {
  successCodes: { createdCode, okCode },
  clientErrors: { unauthorizedCode, conflictCode },
} = httpStatusCodes;

const { cookieMaxAge, cookieName } = singleSignOnCookie;

beforeEach(() => {
  jest.clearAllMocks();
});

const req: Partial<Request> = {};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  cookie: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a registerUser Controller", () => {
  const registerUserBody = getMockUserData({ email: luisEmail });

  describe("When it receives a request with a user data with email: 'luisito@isdicoders.com'", () => {
    test("Then it should call the response method status with a 201, and method json with a user with email 'luisito@isdicoders.com", async () => {
      const userCreatedMock: UserWithId = getMockUser(registerUserBody);
      const expectedStatus = createdCode;

      req.body = registerUserBody;

      User.create = jest
        .fn()
        .mockReturnValueOnce({ ...userCreatedMock, save: jest.fn() });

      bcrypt.hash = jest.fn().mockResolvedValueOnce("mock activation key");

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: userCreatedMock._id,
          name: userCreatedMock.name,
          email: userCreatedMock.email,
        },
      });
    });
  });

  describe("When it receives a request with a user name that already exist", () => {
    test("Then it should call next with an error message 'User already exists'", async () => {
      const customErrorDuplicateKey = new CustomError(
        "Duplicate key",
        conflictCode,
        "User already exists"
      );

      User.create = jest.fn().mockRejectedValue(customErrorDuplicateKey);
      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customErrorDuplicateKey);
    });
  });
});

describe("Given a loginUser controller", () => {
  const incorrectCredentialsMessage = "Incorrect email or password";
  const userCredentials = getMockUserCredentials({ email: luisEmail });
  const mockToken = getMockToken();

  describe("When it receives a request with email 'luisito@isdicoders.com' and the user doesn't exist, and a next function", () => {
    test("Then next should be invoked with message 'User not found', status 401 and public message 'Incorrect email or password'", async () => {
      req.body = userCredentials;

      User.findOne = jest.fn().mockResolvedValueOnce(null);

      const userNotFoundError = new CustomError(
        "User not found",
        unauthorizedCode,
        incorrectCredentialsMessage
      );

      await loginUser(req as Request, null, next);

      expect(next).toHaveBeenCalledWith(userNotFoundError);
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com' and password 'luisito' and the password is incorrect, and a next function", () => {
    test("Then next should be invoked with message 'Incorrect password', status code 401 and public message 'Incorrect email or password'", async () => {
      const incorrectPassword = "luisito";
      const incorrectUserCredentials = {
        ...userCredentials,
        password: incorrectPassword,
      };
      req.body = incorrectUserCredentials;

      User.findOne = jest.fn().mockResolvedValueOnce(incorrectUserCredentials);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(false);

      const incorrectPasswordError = new CustomError(
        "Incorrect password",
        unauthorizedCode,
        incorrectCredentialsMessage
      );

      await loginUser(req as Request, null, next);

      expect(next).toHaveBeenCalledWith(incorrectPasswordError);
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com', a correct password and the user exists and is active", () => {
    test("Then it should invoke the response's status method with 200 and json with a token", async () => {
      req.body = userCredentials;

      const existingUser = getMockUser({ ...userCredentials, isActive: true });

      User.findOne = jest.fn().mockResolvedValueOnce(existingUser);

      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      jwt.sign = jest.fn().mockReturnValueOnce(mockToken);

      await loginUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.cookie).toHaveBeenCalledWith(cookieName, mockToken, {
        httpOnly: true,
        maxAge: cookieMaxAge,
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "coders_identity_token has been set",
      });
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com', a correct password and the password is correct and the user exists but is inactive", () => {
    test("Then it should invoke next with message 'User is inactive', status 401 and public message 'User is inactive, contact your administrator if you think this is a mistake'", async () => {
      req.body = userCredentials;
      const existingUser = getMockUser(userCredentials);

      const inactiveUserError = new CustomError(
        "User is inactive",
        unauthorizedCode,
        "User is inactive, contact your administrator if you think this is a mistake"
      );

      User.findOne = jest.fn().mockResolvedValueOnce(existingUser);

      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      await loginUser(req as Request, null, next);

      expect(next).toHaveBeenCalledWith(inactiveUserError);
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com', a password and bcrypt rejects, and a next function", () => {
    test("Then it should invoke next with the error thrown by bcrypt", async () => {
      const bcryptError = new Error();

      req.body = userCredentials;

      User.findOne = jest.fn().mockResolvedValueOnce(userCredentials);
      bcrypt.compare = jest.fn().mockRejectedValueOnce(bcryptError);

      await loginUser(req as Request, null, next);

      expect(next).toHaveBeenCalledWith(bcryptError);
    });
  });
});
