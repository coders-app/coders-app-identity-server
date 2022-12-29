import { Joi } from "express-validation";
import type { UserStructure } from "../../database/models/User";
import joiTypesError from "./joiTypesErrors.js";
import { emailSchema, passwordSchema } from "./userCredentialSchemas.js";

export interface RegisterUserBody extends UserStructure {
  repeatedPassword: string;
}

const { stringEmpty } = joiTypesError;

const registerUserSchema = {
  body: Joi.object<RegisterUserBody>({
    name: Joi.string()
      .required()
      .messages({
        [stringEmpty]: "Name shouldn't be empty",
      }),
    password: passwordSchema,
    email: emailSchema,
  }),
};

export default registerUserSchema;
