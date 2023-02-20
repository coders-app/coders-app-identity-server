import type { Request, NextFunction, Response } from "express";
import generalError, { unknownEndpoint } from "./errors";
import CustomError from "../../../CustomError/CustomError";
import httpStatusCodes from "../../../utils/httpStatusCodes";

const {
  serverErrors: { internalServerErrorCode },
  clientErrors: { notFoundCode },
} = httpStatusCodes;

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given the generalError middleware", () => {
  describe("When it receives an error with private message 'There was an error' and a response", () => {
    test("Then it should invoke the response's status method with 500 and json with 'There was an error on the server'", () => {
      const privateMessage = "There was an error";
      const error = new Error(privateMessage);
      const expectedPublicMessage = "There was an error on the server";

      generalError(error as CustomError, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(internalServerErrorCode);
      expect(res.json).toHaveBeenCalledWith({ error: expectedPublicMessage });
    });
  });

  describe("When it receives a custom error with private message 'Not found', status code 404 and public message 'Resource not found' and a response", () => {
    test("Then it should invoke the response's status method with the received code and json with the received public message", () => {
      const privateMessage = "Not found";
      const publicMessage = "Resource not found";
      const customError = new CustomError(
        privateMessage,
        notFoundCode,
        publicMessage
      );

      generalError(customError, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(notFoundCode);
      expect(res.json).toHaveBeenCalledWith({ error: publicMessage });
    });
  });
});

describe("Given an unknownEndpoint middleware", () => {
  describe("When it receives a request with path /not-found", () => {
    test("Then it should invoke next with a custom error with message 'Unknown endpoint: /not-found', status code 404 and public message 'Unknown endpoint'", () => {
      const path = "/not-found";
      const errorMessage = "Unknown endpoint";
      const req: Partial<Request> = { path };
      const next: NextFunction = jest.fn();
      const expectedError = new CustomError(
        `${errorMessage}: ${path}`,
        notFoundCode,
        errorMessage
      );

      unknownEndpoint(req as Request, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
