import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import paths from "./routes/paths.js";
import pingPongProtocolRouter from "./routes/pingPongProtocolRouter/pingPongProtocolRouter.js";
import openApiDocument from "../openapi/index.js";

const { baseUrl, apiDocs } = paths;

const app = express();

app.use(cors());
app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use(baseUrl, pingPongProtocolRouter);
app.use(apiDocs, swaggerUi.serve, swaggerUi.setup(openApiDocument));

export default app;
