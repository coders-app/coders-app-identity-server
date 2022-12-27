import type { UserStructure } from "../../../database/models/User";

export type LoginCredentials = Pick<UserStructure, "email" | "password">;
