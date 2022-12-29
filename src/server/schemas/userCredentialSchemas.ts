import { Joi } from "express-validation";
import joiTypesError from "./joiTypesErrors.js";

const { emailInvalid, stringEmpty, stringMin } = joiTypesError;

export const emailSchema = Joi.string()
  .required()
  .email()
  .messages({
    [stringEmpty]: "Email shouldn't be empty",
    [emailInvalid]: "Incorrect email format",
  })
  .label("Email");

export const passwordSchema = Joi.string()
  .min(8)
  .required()
  .messages({
    [stringMin]: "Password should have 8 characters minimum",
    [stringEmpty]: "Password shouldn't be empty",
  });
