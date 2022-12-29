import express from "express";
import morgan from "morgan";
import cors from "cors";
import basicAuth from "express-basic-auth";
import swaggerUi from "swagger-ui-express";
import paths from "./routes/paths.js";
import pingPongProtocolRouter from "./routes/pingPongProtocolRouter/pingPongProtocolRouter.js";
import corsOptions from "./cors/corsOptions.js";
import generalError, { unknownEndpoint } from "./middlewares/errors.js";
import openApiDocument from "../openapi/index.js";
import usersRouter from "./routes/usersRouter/usersRouter.js";
import { environment } from "../loadEnvironments.js";

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
      [environment.basicAuth.username]: environment.basicAuth.password,
    },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument)
);
app.use(users, usersRouter);

app.use(unknownEndpoint);
app.use(generalError);

export default app;
