import { Router } from "express";
import cookieParser from "cookie-parser";
import userAuthentication from "../../controllers/authControllers/authControllers.js";
import { partialPaths } from "../paths.js";

// eslint-disable-next-line new-cap
const verifyTokenRouter = Router();

verifyTokenRouter.use(cookieParser());

verifyTokenRouter.get(partialPaths.users.verifyToken, userAuthentication);

export default verifyTokenRouter;
