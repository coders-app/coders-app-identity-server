import request from "supertest";
import app from "../../app";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes";
import { paths } from "../paths";

const {
  successCodes: { okCode },
} = httpStatusCodes;

describe("Given a GET / endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with status 200 and message 'Pong 🏓'", async () => {
      const expectedStatus = okCode;
      const expectedMessage = "Pong 🏓";

      const response = await request(app)
        .get(paths.root)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("message", expectedMessage);
    });
  });
});
