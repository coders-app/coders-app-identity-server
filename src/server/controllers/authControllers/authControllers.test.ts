import type { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError";
import {
  getMockToken,
  mockTokenPayload,
} from "../../../testUtils/mocks/mockToken";
import errorMessages from "../../../utils/errorMessages";
import httpStatusCodes from "../../../utils/httpStatusCodes";
import userAuthentication from "./authControllers";

const {
  clientErrors: { unauthorizedCode },
} = httpStatusCodes;
const {
  clientErrors: { notTokenMessage, missingBearerMessage },
} = errorMessages;
const req: Partial<Request> = {};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next: NextFunction = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("Given the auth controller", () => {
  const mockToken = getMockToken();
  const mockAuthorizationHeader = `Bearer ${mockToken}`;

  describe("When it receives a request with no auth header", () => {
    test("Then it should invoke next with an error with status 401 and message 'No Token provided'", () => {
      const expectedErrorMessage = "No Token provided";
      const noTokenError = new CustomError(
        notTokenMessage,
        unauthorizedCode,
        expectedErrorMessage
      );

      req.header = jest.fn().mockReturnValueOnce(undefined);

      userAuthentication(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(noTokenError);
    });
  });

  describe("When it receives a request with an auth header that doesn't start with 'Bearer'", () => {
    test("Then it should invoke next with an error with status 401 and message 'Missing Bearer in token'", () => {
      const expectedErrorMessage = "Missing Bearer in token";
      const noBearerError = new CustomError(
        missingBearerMessage,
        unauthorizedCode,
        expectedErrorMessage
      );

      req.header = jest.fn().mockReturnValueOnce("#");

      userAuthentication(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(noBearerError);
    });
  });

  describe("When it receives a request with an auth header that has a malformed token", () => {
    test("Then it should invoke next with a 'jwt malformed' error", () => {
      const jwtError = new Error("jwt malformed");
      const notVerifyTokenError = new CustomError(
        jwtError.message,
        unauthorizedCode,
        "Unauthorized"
      );

      jwt.verify = jest.fn().mockReturnValueOnce(jwtError);
      req.header = jest.fn().mockReturnValueOnce("Bearer #");

      userAuthentication(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(notVerifyTokenError);
    });
  });

  describe("When it receives a request with an auth header that has a valid token", () => {
    test("Then it should invoke the response method status with a 200", () => {
      const expectedStatus = 200;
      const mockVerifyToken = mockTokenPayload;

      jwt.verify = jest.fn().mockReturnValue(mockVerifyToken);
      req.header = jest.fn().mockReturnValueOnce(mockAuthorizationHeader);

      userAuthentication(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ userPayload: mockVerifyToken });
    });

    test("Then it should invoke the response method json with name 'admin'and id: '637ca68b2e7c24060c5c7e20' as payload", () => {
      const mockVerifyToken = mockTokenPayload;

      jwt.verify = jest.fn().mockReturnValue(mockVerifyToken);
      req.header = jest.fn().mockReturnValueOnce(mockAuthorizationHeader);

      userAuthentication(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        userPayload: mockVerifyToken,
      });
    });
  });
});
