import { Router } from "express";
import getPong from "../../controllers/pingPongProtocolControllers/pingPongProtocolController.js";
import paths from "../paths.js";

const { baseUrl } = paths;

// eslint-disable-next-line new-cap
const pingPongProtocolRouter = Router();

pingPongProtocolRouter.get(baseUrl, getPong);

export default pingPongProtocolRouter;
