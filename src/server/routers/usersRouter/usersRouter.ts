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
import activateUserSchema from "../../schemas/activateUserSchema.js";
import { noAbortEarly } from "../../schemas/validateOptions.js";

const { register, login, activate } = paths;

// eslint-disable-next-line new-cap
const usersRouter = Router();

usersRouter.post(
  register,
  validate(registerUserSchema, {}, noAbortEarly),
  registerUser
);

usersRouter.post(login, validate(loginUserSchema, {}, noAbortEarly), loginUser);

usersRouter.post(
  activate,
  validate(activateUserSchema, {}, noAbortEarly),
  activateUser
);

export default usersRouter;
