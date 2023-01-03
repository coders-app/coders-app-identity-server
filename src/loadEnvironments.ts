import dotenv from "dotenv";

dotenv.config();

const {
  PORT: port,
  MONGODB_URL: mongoDbUrl,
  MONGODB_DEBUG: mongoDbDebug,
  ORIGIN_WHITELIST: originWhitelist,
  JWT_SECRET: jwtSecret,
  BASIC_AUTH_USERNAME: basicAuthUsername,
  BASIC_AUTH_PASSWORD: basicAuthPassword,
  SENDGRID_API_KEY: sendgridApiKey,
  SMTP_HOST: smtpHost,
  SMTP_PORT: smtpPort,
  SMTP_USERNAME: smtpUsername,
  EMAIL_SENDER: emailSender,
} = process.env;

export const environment = {
  port,
  mongoDbUrl,
  mongoDbDebug: mongoDbDebug === "true",
  originWhitelist: originWhitelist.split(","),
  jwtSecret,
  basicAuth: {
    username: basicAuthUsername,
    password: basicAuthPassword,
  },
  smtp: {
    host: smtpHost,
    username: smtpUsername,
    password: sendgridApiKey,
    port: +smtpPort,
    emailSender,
  },
};
