import { Router } from "express";
import { validate } from "express-validation";
import {
  activateUser,
  getUserDetails,
  loginUser,
  registerUser,
} from "../../controllers/userControllers/userControllers.js";
import registerUserSchema from "../../schemas/registerUserSchema.js";
import loginUserSchema from "../../schemas/loginUserSchema.js";
import activateUserSchema from "../../schemas/activateUserSchema.js";
import { noAbortEarly } from "../../schemas/validateOptions.js";
import { partialPaths } from "../paths.js";
import cookieParser from "cookie-parser";
import auth from "../../middlewares/auth/auth.js";

// eslint-disable-next-line new-cap
const usersRouter = Router();

usersRouter.post(
  partialPaths.users.register,
  validate(registerUserSchema, {}, noAbortEarly),
  registerUser
);

usersRouter.post(
  partialPaths.users.login,
  validate(loginUserSchema, {}, noAbortEarly),
  loginUser
);

usersRouter.post(
  partialPaths.users.activate,
  validate(activateUserSchema, {}, noAbortEarly),
  activateUser
);

usersRouter.use(cookieParser());

usersRouter.get(partialPaths.users.verifyToken, auth, getUserDetails);

export default usersRouter;
