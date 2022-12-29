import path from "path";
import { fileURLToPath } from "url";
import { loadJson } from "../utils/loadJson.js";

const __dirname = fileURLToPath(path.dirname(import.meta.url));
const openApiConfigFile = path.join(__dirname, "openapi.json");

console.log(openApiConfigFile);
const openApiDocument = loadJson<Record<string, unknown>>(openApiConfigFile);

export default openApiDocument;
