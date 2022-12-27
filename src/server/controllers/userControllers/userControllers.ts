import bcrypt from "bcryptjs";
import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";
import type { UserStructure } from "../../../database/models/User.js";
import User from "../../../database/models/User.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import type { CustomTokenPayload, LoginCredentials } from "./types.js";
import { environment } from "../../../loadEnvironments.js";

const { jwtSecret } = environment;

const saltLength = 10;

const {
  successCodes: { createdCode, okCode },
  clientErrors: { conflictCode, unauthorizedCode },
} = httpStatusCodes;

export const registerUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserStructure>,
  res: Response,
  next: NextFunction
) => {
  const { name, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltLength);

    const newUser = await User.create({
      name,
      password: hashedPassword,
      email,
    });

    res.status(createdCode).json({ user: { id: newUser._id, name, email } });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      conflictCode,
      "Error creating a new user"
    );
    next(customError);
  }
};

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    LoginCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const unauthorizedMessage = "Incorrect email or password";

    if (!user) {
      next(
        new CustomError("User not found", unauthorizedCode, unauthorizedMessage)
      );
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      next(
        new CustomError(
          "Incorrect password",
          unauthorizedCode,
          unauthorizedMessage
        )
      );
      return;
    }

    if (!user.isActive) {
      next(
        new CustomError(
          "User is inactive",
          401,
          "User is inactive, contact your administrator if you think this is a mistake"
        )
      );
    }

    const tokenPayload: CustomTokenPayload = {
      name: user.name,
      id: user._id.toString(),
    };

    const token = jwt.sign(tokenPayload, jwtSecret);

    res.status(okCode).json({ token });
  } catch (error: unknown) {
    next(error);
  }
};
