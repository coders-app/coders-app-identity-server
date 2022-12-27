import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import type { UserStructure } from "../../../database/models/User.js";
import User from "../../../database/models/User.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import { registerUser } from "./userControllers.js";

const {
  successCodes: { createdCode },
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
  describe("When it receives a request with name 'user', password: 'user123', email: 'user@gmail.com'", () => {
    test("Then it should call the response method status with a 201", async () => {
      const registerBody: Partial<UserStructure> = {
        name: "user",
        password: "user123",
      };
      req.body = registerBody;
      const hashedPassword = "hashedpassword";
      const expectedStatus = createdCode;

      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      User.create = jest.fn();

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request and there is an error", () => {
    test("Then it should call next with a custom Error", async () => {
      const error = new Error("");

      User.create = jest.fn().mockRejectedValue(error);
      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
