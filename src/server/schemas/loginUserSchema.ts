import { Joi } from "express-validation";
import type { UserCredentials } from "../../types/types.js";
import { emailSchema, passwordSchema } from "./userCredentialSchemas.js";

const loginUserSchema = {
  body: Joi.object<UserCredentials>({
    email: emailSchema,
    password: passwordSchema,
  }),
};

export default loginUserSchema;
