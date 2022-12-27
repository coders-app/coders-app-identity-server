import bcrypt from "bcryptjs";
import type { NextFunction, Response, Request } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import type { UserStructure } from "../../../database/models/User.js";
import User from "../../../database/models/User.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";

const saltLength = 10;

const {
  successCodes: { createdCode },
  clientErrors: { conflictCode },
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