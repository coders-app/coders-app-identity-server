import express from "express";
import morgan from "morgan";
import cors from "cors";
import basicAuth from "express-basic-auth";
import swaggerUi from "swagger-ui-express";
import paths from "./routers/paths.js";
import pingPongProtocolRouter from "./routers/pingPongProtocolRouter/pingPongProtocolRouter.js";
import corsOptions from "./cors/corsOptions.js";
import generalError, { unknownEndpoint } from "./middlewares/errors.js";
import openApiDocument from "../openapi/index.js";
import usersRouter from "./routers/usersRouter/usersRouter.js";
import { environment } from "../loadEnvironments.js";
import verifyTokenRouter from "./routers/verifyTokenRouter/verifyTokenRouter.js";

const { baseUrl, apiDocs, users } = paths;

const app = express();

app.use(cors(corsOptions));
app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use(baseUrl, pingPongProtocolRouter);
app.use(
  apiDocs,
  basicAuth({
    users: {
      [environment.swaggerAuth.username]: environment.swaggerAuth.password,
    },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument)
);
app.use(users, usersRouter);
app.use(users, verifyTokenRouter);

app.use(unknownEndpoint);
app.use(generalError);

export default app;
