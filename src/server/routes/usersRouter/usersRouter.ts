import { Router } from "express";
import { registerUser } from "../../controllers/userControllers/userControllers.js";
import paths from "../paths.js";

const { register } = paths;

// eslint-disable-next-line new-cap
const usersRouter = Router();

usersRouter.post(register, registerUser);

export default usersRouter;
