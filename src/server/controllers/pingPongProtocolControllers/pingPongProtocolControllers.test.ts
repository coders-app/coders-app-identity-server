import type { Response } from "express";
import getPong from "./pingPongProtocolController";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given a getPong controller", () => {
  describe("When it receives a request", () => {
    test("Then it should invoke the response's json method with a message 'Pong 🏓'", () => {
      const expectedMessage = "Pong 🏓";

      getPong(null, res as Response);

      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });
});
