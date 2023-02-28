import type { NextFunction, Request, Response } from "express";
import CustomError from "./CustomError/CustomError";
import { environment } from "./loadEnvironments";
import appAuthenticationNames from "./constants/appAuthenticationNames";
const { apiGatewayKey } = environment;

const { apiKeyHeader } = appAuthenticationNames;

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

        if (req.header(apiKeyHeader) !== apiGatewayKey) {
          next(invalidKeyError);
          return;
        }

        next();
      }
    ),
}));
