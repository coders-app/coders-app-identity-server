import express from "express";
import morgan from "morgan";
import cors from "cors";
import paths from "./routes/paths.js";
import pingPongProtocolRouter from "./routes/pingPongProtocolRouter/pingPongProtocolRouter.js";
import corsOptions from "./cors/corsOptions.js";
import generalError from "./middlewares/errors.js";

const { baseUrl } = paths;

const app = express();

app.use(cors(corsOptions));
app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use(baseUrl, pingPongProtocolRouter);

app.use(generalError);

export default app;
