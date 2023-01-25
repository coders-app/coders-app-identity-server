import bcrypt from "bcryptjs";
import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import { environment } from "../../../loadEnvironments.js";
import type { UserCredentials, UserData } from "../../../types/types.js";
import type { CustomTokenPayload } from "./types.js";
import { loginErrors, registerErrors } from "../../../utils/unifiedErrors.js";
import singleSignOnCookie from "../../../utils/singleSignOnCookie.js";

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
const { cookieName, cookieMaxAge } = singleSignOnCookie;

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
    const messageError = (error as Error).message;
    if (messageError.includes("duplicate key")) {
      next(duplicateKeyError);
      return;
    }

    if (messageError.includes("User already exists")) {
      next(alreadyRegisteredError);
      return;
    }

    if (messageError.includes("Password invalid")) {
      next(invalidPasswordError);
      return;
    }

    if (messageError.includes("Server user error")) {
      next(registerGeneralError);
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

    res
      .status(okCode)
      .cookie(cookieName, token, {
        httpOnly: true,
        maxAge: cookieMaxAge,
      })
      .json({ message: `${cookieName} has been set` });
  } catch (error: unknown) {
    next(error);
  }
};
