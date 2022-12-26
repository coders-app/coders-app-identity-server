import "../loadEnvironments.js";
import debugCreator from "debug";
import chalk from "chalk";
import type { NextFunction, Request, Response } from "express";
import type CustomError from "../CustomError/CustomError.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";

const {
  serverErrors: { internalServerErrorCode: badRequestCode },
} = httpStatusCodes;

const debug = debugCreator("identify-server:middlewares:errors");

const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  debug(chalk.bold.red(error.message));

  const statusCode = error.statusCode || badRequestCode;
  const publicMessage =
    error.publicMessage || "There was an error on the server";

  res.status(statusCode).json({ error: publicMessage });
};

export default generalError;
