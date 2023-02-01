import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { environment } from "../../loadEnvironments.js";
import type { CustomTokenPayload } from "../../server/types.js";

const {
  jwt: { jwtSecret },
} = environment;

export const mockTokenPayload: CustomTokenPayload = {
  name: "admin",
  isAdmin: false,
  id: new mongoose.Types.ObjectId().toString(),
};

export const mockToken = jwt.sign(mockTokenPayload, jwtSecret);
