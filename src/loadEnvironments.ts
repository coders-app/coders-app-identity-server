import dotenv from "dotenv";

dotenv.config();

const {
  PORT: port,
  MONGODB_URL: mongoDbUrl,
  MONGODB_DEBUG: mongoDbDebug,
} = process.env;

export const environment = {
  port,
  mongoDbUrl,
  mongoDbDebug: mongoDbDebug === "true",
};
