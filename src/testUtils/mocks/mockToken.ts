import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { environment } from "../../loadEnvironments.js";
import type { CustomTokenPayload } from "../../server/controllers/userControllers/types";

const { jwtSecret } = environment;

export const mockTokenPayload: CustomTokenPayload = {
  name: "admin",
  isAdmin: false,
  id: new mongoose.Types.ObjectId().toString(),
};

export const getMockToken = () => jwt.sign(mockTokenPayload, jwtSecret);
