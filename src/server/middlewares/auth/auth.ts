import jwt from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import type { CustomRequest, CustomTokenPayload } from "../../types";
import config from "../../../config.js";
import CustomError from "../../../CustomError/CustomError.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import { environment } from "../../../loadEnvironments.js";

const {
  jwt: { jwtSecret },
} = environment;

const {
  singleSignOnCookie: { cookieName },
} = config;

const {
  clientErrors: { unauthorizedCode },
} = httpStatusCodes;

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authToken = (req.cookies as Record<string, string>)[cookieName];

    if (!authToken) {
      throw new CustomError(
        "No Token provided",
        unauthorizedCode,
        "No Token provided"
      );
    }

    const verifyToken: CustomTokenPayload = jwt.verify(
      authToken,
      jwtSecret
    ) as CustomTokenPayload;

    if (verifyToken.name.includes("Error")) {
      throw new CustomError(
        verifyToken.message,
        unauthorizedCode,
        "Unauthorized"
      );
    }

    const { name, isAdmin, id } = verifyToken;

    req.userDetails = { name, isAdmin, id };

    next();
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      unauthorizedCode,
      "Unauthorized"
    );

    next(customError);
  }
};

export default auth;
