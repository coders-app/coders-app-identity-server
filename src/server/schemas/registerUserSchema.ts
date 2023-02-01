import { Joi } from "express-validation";
import type { UserData } from "../types/types.js";
import joiTypesError from "./joiTypesErrors.js";
import { emailSchema } from "./userCredentialSchemas.js";

const { stringEmpty } = joiTypesError;

const registerUserSchema = {
  body: Joi.object<UserData>({
    name: Joi.string()
      .required()
      .messages({
        [stringEmpty]: "Name shouldn't be empty",
      }),
    email: emailSchema,
  }),
};

export default registerUserSchema;
