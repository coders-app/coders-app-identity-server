import type { Request, Response, NextFunction } from "express";
import requestHeaders from "../../../constants/requestHeaders";
import setHeaderCredentials from "./setHeaderCredentials";

const { allowCredentials } = requestHeaders;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a setHeaderCredentials middleware", () => {
  const req: Partial<Request> = {};
  const res: Partial<Response> = {
    header: jest.fn(),
  };

  const next: NextFunction = jest.fn();

  describe("When it receives a response and next function", () => {
    test("Then it should invoke response's method header with 'Access-Control-Allow-Credentials', 'true'", () => {
      setHeaderCredentials(req as Request, res as Response, next);

      expect(res.header).toHaveBeenCalledWith(allowCredentials, "true");
    });

    test("Then it should invoke next function", () => {
      setHeaderCredentials(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
