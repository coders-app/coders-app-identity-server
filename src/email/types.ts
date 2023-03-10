import type nodemailer from "nodemailer";
import type { WithRequiredProperties } from "../types";

export type EmailOptions = WithRequiredProperties<
  nodemailer.SendMailOptions,
  "to" | "subject" | "text"
>;
