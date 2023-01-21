import { Router } from "express";
import { validate } from "express-validation";
import {
  activateUser,
  loginUser,
  registerUser,
} from "../../controllers/userControllers/userControllers.js";
import registerUserSchema from "../../schemas/registerUserSchema.js";
import paths from "../paths.js";
import loginUserSchema from "../../schemas/loginUserSchema.js";

const { register, login, activate } = paths;

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

usersRouter.post(activate, activateUser);

export default usersRouter;
