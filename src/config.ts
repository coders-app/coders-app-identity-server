import { environment } from "./loadEnvironments.js";

const config = {
  singleSignOnCookie: {
    cookieName: "coders_identity_token",
    cookieMaxAge: environment.jwt.tokenExpiry,
  },
};

export default config;
