import bcrypt from "bcryptjs";
import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import { environment } from "../../../loadEnvironments.js";
import type { UserCredentials, UserData } from "../../../types/types.js";
import type { CustomTokenPayload } from "./types.js";
import { loginErrors, registerErrors } from "../../../utils/unifiedErrors.js";

const {
  jwt: { jwtSecret, tokenExpiry },
} = environment;

const {
  successCodes: { createdCode, okCode },
} = httpStatusCodes;

const { userNotFoundError, incorrectPasswordError, inactiveUserError } =
  loginErrors;
const {
  duplicateKeyError,
  registerGeneralError,
  alreadyRegisteredError,
  invalidPasswordError,
} = registerErrors;

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
    switch (error) {
      case (error as Error).message.includes("Duplicate key"):
        next(duplicateKeyError);
        break;
      case (error as Error).message.includes("Existing user"):
        next(alreadyRegisteredError);
        break;
      case (error as Error).message.includes("Password invalid"):
        next(invalidPasswordError);
        break;

      default:
        next(registerGeneralError);
        break;
    }
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
