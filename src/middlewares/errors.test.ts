import type { Response } from "express";
import generalError from "./errors";
import CustomError from "../CustomError/CustomError";
import httpStatusCodes from "../utils/httpStatusCodes";

const {
  serverErrors: { badRequestCode },
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

      expect(res.status).toHaveBeenCalledWith(badRequestCode);
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
