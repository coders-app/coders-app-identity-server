import { environment } from "../loadEnvironments";

const appAuthenticationNames = {
  apiKeyHeader: "X-API-KEY",
  current: environment.appName,
  apiGateway: "api-gateway",
};

export default appAuthenticationNames;
