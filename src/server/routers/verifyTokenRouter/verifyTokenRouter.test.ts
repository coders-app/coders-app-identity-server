import request from "supertest";
import app from "../../app.js";
import paths from "../paths.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import {
  mockToken,
  mockTokenPayload,
} from "../../../testUtils/mocks/mockToken.js";
import type { CustomTokenPayload } from "../../controllers/userControllers/types.js";
import singleSignOnCookie from "../../../utils/singleSignOnCookie.js";

const { verifyToken, users } = paths;

const { cookieName } = singleSignOnCookie;

const correctCookie = `${cookieName}=${mockToken}`;
const incorrectCookie = `${cookieName}=incorrect-sdfcookie`;

const {
  successCodes: { okCode },
  clientErrors: { unauthorizedCode },
} = httpStatusCodes;

describe("Given a GET /verify-token endpoint", () => {
  const expectedMessage = "Unauthorized";

  describe("When it receives a request with no cookie", () => {
    test("Then it should respond with status 401 and 'Unauthorized' error message ", async () => {
      const expectedStatus = unauthorizedCode;

      const response: {
        body: { userPayload: CustomTokenPayload };
      } = await request(app)
        .get(`${users}${verifyToken}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });

  describe("When it receives a request with a cookie and a valid token", () => {
    test("Then it should respond with status 200 and userPayload in the body", async () => {
      const expectedStatus = okCode;

      const response: {
        body: { userPayload: CustomTokenPayload };
      } = await request(app)
        .get(`${users}${verifyToken}`)
        .set("Cookie", [correctCookie])
        .send(mockTokenPayload)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("userPayload", mockTokenPayload);
    });
  });

  describe("When it receives a request with auth header and an invalid token", () => {
    test("Then it should respond with status 401 and error message 'Unauthorized'", async () => {
      const expectedStatus = unauthorizedCode;

      const response: {
        body: { userPayload: CustomTokenPayload };
      } = await request(app)
        .get(`${users}${verifyToken}`)
        .set("Cookie", [incorrectCookie])
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
