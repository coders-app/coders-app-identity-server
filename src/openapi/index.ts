import path from "path";
import { loadJson } from "../utils/loadJson.js";

const openApiConfigFile = path.join(
  process.argv[1],
  "build/openapi/openapi.json"
);

const openApiDocument = loadJson<Record<string, unknown>>(openApiConfigFile);

export default openApiDocument;
