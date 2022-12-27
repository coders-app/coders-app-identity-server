import bcrypt from "bcryptjs";
import type { NextFunction, Response, Request } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import type { UserStructure } from "../../../database/models/User.js";
import User from "../../../database/models/User.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import type { LoginCredentials } from "./types.js";

const saltLength = 10;

const {
  successCodes: { createdCode },
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
  } catch (error: unknown) {
    next(error);
  }
};
