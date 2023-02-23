import express from "express";
import morgan from "morgan";
import cors from "cors";
import basicAuth from "express-basic-auth";
import swaggerUi from "swagger-ui-express";
import * as apiKeyAuthenticator from "coders-app-api-key-authenticator";
import pingPongProtocolRouter from "./routers/pingPongProtocolRouter/pingPongProtocolRouter.js";
import corsOptions from "./cors/corsOptions.js";
import generalError, { unknownEndpoint } from "./middlewares/errors/errors.js";
import openApiDocument from "../openapi/index.js";
import usersRouter from "./routers/usersRouter/usersRouter.js";
import { environment } from "../loadEnvironments.js";
import verifyTokenRouter from "./routers/verifyTokenRouter/verifyTokenRouter.js";
import { partialPaths, paths } from "./routers/paths.js";
import setHeaderCredentials from "./middlewares/setHeaderCredentials/setHeaderCredentials.js";
import appAuthenticationNames from "../constants/appAuthenticationNames.js";

const { current: currentApp, apiGateway } = appAuthenticationNames;

const { checkApiKey } = apiKeyAuthenticator;

const app = express();

app.use(setHeaderCredentials);

app.use(cors(corsOptions));
app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use(paths.root, pingPongProtocolRouter);
app.use(
  paths.apiDocs.base,
  basicAuth({
    users: {
      [environment.swaggerAuth.username]: environment.swaggerAuth.password,
    },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument)
);

app.use(
  partialPaths.users.base,
  checkApiKey(currentApp, apiGateway),
  usersRouter
);
app.use(partialPaths.users.base, verifyTokenRouter);

app.use(unknownEndpoint);
app.use(generalError);

export default app;
