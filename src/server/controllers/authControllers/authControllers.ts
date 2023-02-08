import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { environment } from "../../../loadEnvironments.js";
import CustomError from "../../../CustomError/CustomError.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import type { CustomTokenPayload } from "../../types.js";
import singleSignOnCookie from "../../../utils/singleSignOnCookie.js";

const {
  successCodes: { okCode },
  clientErrors: { unauthorizedCode },
} = httpStatusCodes;

const {
  jwt: { jwtSecret },
} = environment;

const { cookieName } = singleSignOnCookie;

const userAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    res.status(okCode).json({ userPayload: { name, isAdmin, id } });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      unauthorizedCode,
      "Unauthorized"
    );

    next(customError);
  }
};

export default userAuthentication;
