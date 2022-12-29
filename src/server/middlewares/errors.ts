import "../../loadEnvironments.js";
import debugCreator from "debug";
import chalk from "chalk";
import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import CustomError from "../../CustomError/CustomError.js";
import httpStatusCodes from "../../utils/httpStatusCodes.js";

const {
  serverErrors: { internalServerErrorCode },
  clientErrors: { notFoundCode },
} = httpStatusCodes;

const debug = debugCreator("identity-server:middlewares:errors");

const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    const validationErrors = error.details.body
      .map((joiError) => joiError.message)
      .join("\n");

    error.publicMessage = validationErrors;

    debug(chalk.blueBright(validationErrors));
  }

  const statusCode = error.statusCode || internalServerErrorCode;
  const publicMessage =
    error.publicMessage || "There was an error on the server";

  debug(chalk.bold.red(error.message));

  res.status(statusCode).json({ error: publicMessage });
};

export const unknownEndpoint = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { path } = req;

  next(
    new CustomError(
      `Unknown endpoint: ${path}`,
      notFoundCode,
      "Unknown endpoint"
    )
  );
};

export default generalError;
