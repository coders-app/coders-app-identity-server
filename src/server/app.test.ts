import request from "supertest";
import app from "./app";
import httpStatusCodes from "../constants/statusCodes/httpStatusCodes";

const {
  clientErrors: { notFoundCode },
} = httpStatusCodes;

describe("Given a GET /not-found endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with status 404 and 'Unknown endpoint'", async () => {
      const unknownEndpoint = "/not-found";
      const expectedError = "Unknown endpoint";

      const response = await request(app)
        .get(unknownEndpoint)
        .expect(notFoundCode);

      expect(response.body).toHaveProperty("error", expectedError);
    });
  });
});
