import { Joi } from "express-validation";
import type { UserActivationCredentials } from "../types/types.js";
import { activationPasswordSchema } from "./userCredentialSchemas.js";
import joiTypesError from "./joiTypesErrors.js";

const { anyOnly } = joiTypesError;

const activateUserSchema = {
  body: Joi.object<UserActivationCredentials>({
    password: activationPasswordSchema,
    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ [anyOnly]: "Passwords must match" }),
  }),
};

export default activateUserSchema;
