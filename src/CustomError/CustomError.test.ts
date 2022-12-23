import CustomError from "./CustomError";

describe("Given a CustomError", () => {
  describe("When it is instantiated with private message: 'Unknown error', status code 500 and public message 'Something went wrong on the server'", () => {
    test("Then it should create an object with the receives properties and values", () => {
      const privateMessage = "Unknown error";
      const statusCode = 500;
      const publicMessage = "Something went wrong on the server";

      const customError = new CustomError(
        privateMessage,
        statusCode,
        publicMessage
      );

      expect(customError).toHaveProperty("publicMessage", publicMessage);
      expect(customError).toHaveProperty("message", privateMessage);
      expect(customError).toHaveProperty("statusCode", statusCode);
    });
  });
});
