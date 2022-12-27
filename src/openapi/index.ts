import { loadJson } from "../utils/loadJson.js";

const openApiDocument = loadJson<Record<string, unknown>>("../openapi.json");

export default openApiDocument;
