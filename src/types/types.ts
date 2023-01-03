import type nodemailer from "nodemailer";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserData extends Omit<UserCredentials, "password"> {
  name: string;
}

export interface UserStructure
  extends UserData,
    Pick<UserCredentials, "password"> {
  isAdmin: boolean;
  isActive: boolean;
}

export interface UserWithId extends UserStructure {
  _id: string;
}

export type WithRequiredProperties<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

export type EmailOptions = WithRequiredProperties<
  nodemailer.SendMailOptions,
  "to" | "subject" | "text"
>;
