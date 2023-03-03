import type { NextFunction, Request, Response } from "express";
import CustomError from "./CustomError/CustomError";
import requestHeaders from "./constants/requestHeaders";
import {
  mockHeaderApiKey,
  mockHeaderApiName,
} from "./testUtils/mocks/mockRequestHeaders";

const { apiKeyHeader, apiNameHeader } = requestHeaders;

jest.mock("./utils/loadJson/loadJson", () => ({
  loadJson: () => ({}),
}));

jest.mock("./openapi/index", () => ({}));

jest.mock("coders-app-api-key-authenticator", () => ({
  checkApiKey: jest
    .fn()
    .mockImplementation(
      () => async (req: Request, res: Response, next: NextFunction) => {
        const invalidKeyError = new CustomError(
          "Invalid API Key",
          401,
          "Invalid API Key"
        );

        if (
          req.header(apiKeyHeader) !== mockHeaderApiKey ||
          req.header(apiNameHeader) !== mockHeaderApiName
        ) {
          next(invalidKeyError);
          return;
        }

        next();
      }
    ),
}));
