import request from "supertest";
import app from "../../app.js";
import paths from "../paths.js";
import httpStatusCodes from "../../../utils/httpStatusCodes.js";
import {
  mockToken,
  mockTokenPayload,
} from "../../../testUtils/mocks/mockToken.js";
import type { CustomTokenPayload } from "../../types/types.js";

const { verifyToken, users } = paths;

const {
  successCodes: { okCode },
  clientErrors: { unauthorizedCode },
} = httpStatusCodes;

describe("Given a GET /verify-token endpoint", () => {
  const expectedMessage = "Unauthorized";
  const mockAuthorizationHeader = `Bearer ${mockToken}`;

  describe("When it receives a request with no auth header", () => {
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

  describe("When it receives a request with auth header and a valid token", () => {
    test("Then it should respond with status 200 and userPayload in the body", async () => {
      const expectedStatus = okCode;

      const response: {
        body: { userPayload: CustomTokenPayload };
      } = await request(app)
        .get(`${users}${verifyToken}`)
        .set("Authorization", mockAuthorizationHeader)
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
        .set("Authorization", "Bearer #")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
