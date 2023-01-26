import { Router } from "express";
import cookieParser from "cookie-parser";
import userAuthentication from "../../controllers/authControllers/authControllers.js";
import paths from "../paths.js";
const { verifyToken } = paths;

// eslint-disable-next-line new-cap
const verifyTokenRouter = Router();

verifyTokenRouter.use(cookieParser());

verifyTokenRouter.get(verifyToken, userAuthentication);

export default verifyTokenRouter;
