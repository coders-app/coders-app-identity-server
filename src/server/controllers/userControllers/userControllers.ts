import bcrypt from "bcryptjs";
import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import { environment } from "../../../loadEnvironments.js";
import type {
  UserActivationCredentials,
  UserCredentials,
  UserData,
} from "../../../types/types.js";
import type { CustomTokenPayload } from "./types.js";
import {
  loginErrors,
  registerErrors,
  activateUserErrors,
} from "../../../utils/unifiedErrors.js";
import sendEmail from "../../../email/sendEmail/sendEmail.js";
import createRegisterEmail from "../../../email/emailTemplates/createRegisterEmail.js";
import singleSignOnCookie from "../../../utils/singleSignOnCookie.js";
import mongoose from "mongoose";

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
const { invalidActivationKeyError } = activateUserErrors;
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

    const userId = newUser._id.toString();

    const activationKey = await bcrypt.hash(userId, 10);

    newUser.activationKey = activationKey;

    await newUser.save();

    const { text, subject } = createRegisterEmail(name, userId);

    await sendEmail({
      to: email,
      text,
      subject,
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

export const activateUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserActivationCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { activationKey: userId } = req.query;

  const { password } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      throw invalidActivationKeyError;
    }

    const user = await User.findById(userId);

    if (!user) {
      throw invalidActivationKeyError;
    }

    if (
      !user.activationKey ||
      !(await bcrypt.compare(userId as string, user.activationKey))
    ) {
      throw invalidActivationKeyError;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.isActive = true;

    await user.save();

    res.status(okCode).json({ message: "User account has been activated" });
  } catch (error: unknown) {
    next(error);
  }
};
