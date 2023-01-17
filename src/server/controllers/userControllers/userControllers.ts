import bcrypt from "bcryptjs";
import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import { environment } from "../../../loadEnvironments.js";
import type { UserCredentials, UserData } from "../../../types/types.js";
import type { CustomTokenPayload } from "./types.js";
import { loginErrors } from "../../../utils/unifiedErrors.js";

const {
  jwt: { jwtSecret, tokenExpiry },
} = environment;

const {
  successCodes: { createdCode, okCode },
  clientErrors: { conflictCode },
  serverErrors: { internalServerErrorCode },
} = httpStatusCodes;

const { userNotFoundError, incorrectPasswordError, inactiveUserError } =
  loginErrors;

export const registerUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserData>,
  res: Response,
  next: NextFunction
) => {
  const { name, email } = req.body;

  try {
    const newUser = await User.create({
      name,
      email,
    });

    res.status(createdCode).json({ user: { id: newUser._id, name, email } });
  } catch (error: unknown) {
    if ((error as Error).message.includes("duplicate key")) {
      const customErrorDuplicateKey = new CustomError(
        (error as Error).message,
        conflictCode,
        "User already exists"
      );
      next(customErrorDuplicateKey);
      return;
    }

    const customError = new CustomError(
      (error as Error).message,
      internalServerErrorCode,
      "Error creating a new user"
    );

    next(customError);
  }
};

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw userNotFoundError;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw incorrectPasswordError;
    }

    if (!user.isActive) {
      throw inactiveUserError;
    }

    const tokenPayload: CustomTokenPayload = {
      name: user.name,
      isAdmin: user.isAdmin,
      id: user._id.toString(),
    };

    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: tokenExpiry });

    res.status(okCode).json({ token });
  } catch (error: unknown) {
    next(error);
  }
};
