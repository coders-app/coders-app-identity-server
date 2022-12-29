import { Joi } from "express-validation";
import type { LoginCredentials } from "../controllers/userControllers/types";
import { emailSchema, passwordSchema } from "./registerUserSchema";

const loginUserSchema = {
  body: Joi.object<LoginCredentials>({
    email: emailSchema,
    password: passwordSchema,
  }),
};

export default loginUserSchema;
