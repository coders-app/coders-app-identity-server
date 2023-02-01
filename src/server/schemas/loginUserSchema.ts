import { Joi } from "express-validation";
import type { UserCredentials } from "../types/types.js";
import { emailSchema, loginPasswordSchema } from "./userCredentialSchemas.js";

const loginUserSchema = {
  body: Joi.object<UserCredentials>({
    email: emailSchema,
    password: loginPasswordSchema,
  }),
};

export default loginUserSchema;
