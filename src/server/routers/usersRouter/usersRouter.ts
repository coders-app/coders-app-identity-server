import { Router } from "express";
import { validate } from "express-validation";
import {
  loginUser,
  registerUser,
} from "../../controllers/userControllers/userControllers.js";
import registerUserSchema from "../../schemas/registerUserSchema.js";
import paths from "../paths.js";
import loginUserSchema from "../../schemas/loginUserSchema.js";

const { register, login } = paths;

// eslint-disable-next-line new-cap
const usersRouter = Router();

usersRouter.post(
  register,
  validate(registerUserSchema, {}, { abortEarly: false }),
  registerUser
);

usersRouter.post(
  login,
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;