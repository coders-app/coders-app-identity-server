import jwt from "jsonwebtoken";
import { environment } from "../../loadEnvironments.js";
import type { CustomTokenPayload } from "../../server/controllers/userControllers/types";

const { jwtSecret } = environment;

export const mockTokenPayload: CustomTokenPayload = {
  name: "admin",
  isAdmin: false,
  id: "637ca68b2e7c24060c5c7e20",
};

const token = jwt.sign(mockTokenPayload, jwtSecret);

export const mockToken = `Bearer ${token}`;
