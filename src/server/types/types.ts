import type { JwtPayload } from "jsonwebtoken";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserActivationCredentials
  extends Pick<UserCredentials, "password"> {
  confirmPassword: string;
}

export interface UserData extends Omit<UserCredentials, "password"> {
  name: string;
}
export interface UserStructure
  extends UserData,
    Pick<UserCredentials, "password"> {
  isAdmin: boolean;
  isActive: boolean;
  activationKey: string;
}
export interface CustomTokenPayload
  extends Pick<UserStructure, "name" | "isAdmin">,
    JwtPayload {
  id: string;
}

export interface UserWithId extends UserStructure {
  _id: string;
}
