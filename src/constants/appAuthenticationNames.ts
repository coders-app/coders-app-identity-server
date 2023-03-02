import { environment } from "../loadEnvironments";

const appAuthenticationNames = {
  apiKeyHeader: "X-API-KEY",
  apiNameHeader: "X-API-NAME",
  current: environment.appName,
  apiGateway: "api-gateway",
};

export default appAuthenticationNames;
