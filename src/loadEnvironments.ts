import dotenv from "dotenv";

dotenv.config();

const {
  PORT: port,
  MONGODB_URL: mongoDbUrl,
  MONGODB_DEBUG: mongoDbDebug,
  ORIGIN_WHITELIST: originWhitelist,
  JWT_SECRET: jwtSecret,
  SWAGGER_BASIC_AUTH_USERNAME: swaggerBasicAuthUsername,
  SWAGGER_BASIC_AUTH_PASSWORD: swaggerBasicAuthPassword,
  SMTP_HOST: smtpHost,
  SMTP_PORT: smtpPort,
  SMTP_USERNAME: smtpUsername,
  SMTP_PASSWORD: smtpPassword,
  EMAIL_SENDER: emailSender,
  TOKEN_EXPIRY: tokenExpiry,
  APP_NAME: appName,
} = process.env;

export const environment = {
  port: +port || 4000,
  mongoDbUrl,
  mongoDbDebug: mongoDbDebug === "true",
  originWhitelist: originWhitelist.split(","),
  jwt: {
    jwtSecret,
    tokenExpiry,
  },
  swaggerAuth: {
    username: swaggerBasicAuthUsername,
    password: swaggerBasicAuthPassword,
  },
  smtp: {
    host: smtpHost,
    username: smtpUsername,
    password: smtpPassword,
    port: +smtpPort,
    emailSender,
  },
  appName,
};
