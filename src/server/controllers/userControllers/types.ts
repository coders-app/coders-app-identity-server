import type { JwtPayload } from "jsonwebtoken";
import type { UserStructure } from "../../../types/types";

export interface CustomTokenPayload
  extends Pick<UserStructure, "name" | "isAdmin">,
    JwtPayload {
  id: string;
}
