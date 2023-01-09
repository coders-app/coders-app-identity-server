import request from "supertest";
import app from "./app";
import httpStatusCodes from "../utils/httpStatusCodes";
import httpErrorMessages from "../utils/httpErrorMessages";
import publicHttpErrorMessages from "../utils/publicHttpErrorMessages";

const {
  clientErrors: { badRequestCode, notFoundCode },
} = httpStatusCodes;
const {
  clientErrors: { unknownEndpointMsg },
} = httpErrorMessages;
const {
  publicClientErrors: { publicBadRequestMsg },
} = publicHttpErrorMessages;
describe("Given a GET / endpoint", () => {
  describe("When it receives a request from an origin that is not whitelisted", () => {
    test("Then it should respond with status 400 and the message 'Blocked by CORS'", async () => {
      const unknownOrigin = "http://localhost:1234";

      const response = await request(app)
        .get("/")
        .set("origin", unknownOrigin)
        .expect(badRequestCode);

      expect(response.body).toHaveProperty(
        "error",
        unknownOrigin + publicBadRequestMsg
      );
    });
  });
});

describe("Given a GET /not-found endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with status 404 and 'Unknown endpoint'", async () => {
      const unknownEndpoint = "/not-found";

      const response = await request(app)
        .get(unknownEndpoint)
        .expect(notFoundCode);

      expect(response.body).toHaveProperty("error", unknownEndpointMsg);
    });
  });
});
