import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import User from "../../../database/models/User.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import { loginUser, registerUser } from "./userControllers.js";
import CustomError from "../../../CustomError/CustomError.js";
import { luisUserMock } from "../../../testUtils/mocks/mockUsers.js";
import type { UserCredentials } from "../../../types/types.js";
import { getMockUserData } from "../../../factories/userDataFactory.js";

const {
  successCodes: { createdCode, okCode },
  clientErrors: { unauthorizedCode, conflictCode },
  serverErrors: { internalServerErrorCode },
} = httpStatusCodes;

beforeEach(() => {
  jest.clearAllMocks();
});

const req: Partial<Request> = {};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a registerUser Controller", () => {
  const registerUserBody = getMockUserData(luisUserMock);

  describe("When it receives a request with name 'Luis', password: 'luisito123', email: 'luisito@isdicoders.com'", () => {
    test("Then it should call the response method status with a 201", async () => {
      const hashedPassword = "hashedpassword";
      const expectedStatus = createdCode;

      req.body = registerUserBody;

      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      User.create = jest.fn();

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request with a user name already exist", () => {
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

  describe("When it receives a request with password 'luisito123' and bcrypt rejects, and a next function", () => {
    test("Then it should invoke next with the error thrown by bcrypt 'Incorrect password'", async () => {
      const bcryptError = new Error();

      req.body = registerUserBody;

      bcrypt.hash = jest.fn().mockRejectedValueOnce(bcryptError);
      User.findOne = jest.fn().mockResolvedValueOnce(registerUserBody);

      await loginUser(req as Request, null, next);
      const customErrorBcrypt = new CustomError(
        "Incorrect password",
        internalServerErrorCode,
        "Error creating a new user"
      );

      expect(next).toHaveBeenCalledWith(customErrorBcrypt);
    });
  });
});

describe("Given a loginUser controller", () => {
  const incorrectCredentialsMessage = "Incorrect email or password";
  const userCredentials = getMockUserData(luisUserMock);
  const { email, password } = userCredentials;
  const loginCredentials: UserCredentials = { email, password };

  describe("When it receives a request with email 'luisito@isdicoders.com' and password 'luisito' and the user doesn't exist, and a next function", () => {
    test("Then next should be invoked with message 'User not found', status 401 and public message 'Incorrect email or password'", async () => {
      req.body = loginCredentials;

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
      req.body = loginCredentials;

      User.findOne = jest.fn().mockResolvedValueOnce(loginCredentials);
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

  describe("When it receives a request with email 'luisito@isdicoders.com' and password 'luisito' and the password is correct and the user exists and is active", () => {
    test("Then it should invoke the response's status method with 200 and json with a token", async () => {
      req.body = loginCredentials;
      const userId = "testid";
      const token = "testtoken";

      User.findOne = jest.fn().mockResolvedValueOnce({
        ...loginCredentials,
        _id: userId,
        isActive: true,
      });

      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      jwt.sign = jest.fn().mockReturnValueOnce(token);

      await loginUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com' and password 'luisito' and the password is correct and the user exists but is inactive", () => {
    test("Then it should invoke next with message 'User is inactive', status 401 and public message 'User is inactive, contact your administrator if you think this is a mistake'", async () => {
      req.body = loginCredentials;
      const userId = "testid";
      const inactiveUserError = new CustomError(
        "User is inactive",
        unauthorizedCode,
        "User is inactive, contact your administrator if you think this is a mistake"
      );

      User.findOne = jest.fn().mockResolvedValueOnce({
        ...loginCredentials,
        _id: userId,
        isActive: false,
      });

      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      await loginUser(req as Request, null, next);

      expect(next).toHaveBeenCalledWith(inactiveUserError);
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com' and password 'luisito' and bcrypt rejects, and a next function", () => {
    test("Then it should invoke next with the error thrown by bcrypt", async () => {
      const bcryptError = new Error();

      req.body = loginCredentials;

      User.findOne = jest.fn().mockResolvedValueOnce(loginCredentials);
      bcrypt.compare = jest.fn().mockRejectedValueOnce(bcryptError);

      await loginUser(req as Request, null, next);

      expect(next).toHaveBeenCalledWith(bcryptError);
    });
  });
});
