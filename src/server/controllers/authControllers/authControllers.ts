import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { environment } from "../../../loadEnvironments.js";
import CustomError from "../../../CustomError/CustomError.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import type { CustomTokenPayload } from "../userControllers/types.js";
import httpErrorMessages from "../../../utils/httpErrorMessages.js";

const {
  successCodes: { okCode },
  clientErrors: { unauthorizedCode },
} = httpStatusCodes;
const {
  clientErrors: { notTokenMsg, missingBearerMsg },
} = httpErrorMessages;
const {
  jwt: { jwtSecret },
} = environment;

const userAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      throw new CustomError(notTokenMsg, unauthorizedCode, "No Token provided");
    }

    if (!authHeader.startsWith("Bearer")) {
      throw new CustomError(
        missingBearerMsg,
        unauthorizedCode,
        "Missing Bearer in token"
      );
    }

    const token = authHeader.replace(/^Bearer\s*/, "");

    const verifyToken: CustomTokenPayload = jwt.verify(
      token,
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
