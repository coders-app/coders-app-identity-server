import { Router } from "express";
import userAuthentication from "../../controllers/authControllers/authControllers.js";
import paths from "../paths.js";

const { verifyToken } = paths;

// eslint-disable-next-line new-cap
const verifyTokenRouter = Router();

verifyTokenRouter.get(verifyToken, userAuthentication);

export default verifyTokenRouter;
