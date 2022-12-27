import { Joi } from "express-validation";
import type { UserStructure } from "../../database/models/User";
import joiTypesError from "./joiTypesErrors";

export interface RegisterUserBody extends UserStructure {
  repeatedPassword: string;
}

const { emailInvalid, stringEmpty, stringMin } = joiTypesError;

const registerUserSchema = {
  body: Joi.object<RegisterUserBody>({
    name: Joi.string()
      .required()
      .messages({
        [stringEmpty]: "Name shouldn't be empty",
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        [stringMin]: "Password should have 8 characters minimum",
        [stringEmpty]: "Password shouldn't be empty",
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        [stringEmpty]: "Email shouldn't be empty",
        [emailInvalid]: "Incorrect email format",
      }),
  }),
};

export default registerUserSchema;
