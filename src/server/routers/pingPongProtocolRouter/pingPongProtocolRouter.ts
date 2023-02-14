import { Router } from "express";
import getPong from "../../controllers/pingPongProtocolControllers/pingPongProtocolController.js";
import { paths } from "../paths.js";

// eslint-disable-next-line new-cap
const pingPongProtocolRouter = Router();

pingPongProtocolRouter.get(paths.root, getPong);

export default pingPongProtocolRouter;
