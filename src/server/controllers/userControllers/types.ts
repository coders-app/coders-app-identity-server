import type { UserStructure } from "../../../database/models/User";
import type { JwtPayload } from "jsonwebtoken";

export type LoginCredentials = Pick<UserStructure, "email" | "password">;

export interface CustomTokenPayload
  extends Pick<UserStructure, "name" | "isAdmin">,
    JwtPayload {
  id: string;
}
