import type { Request, Response, NextFunction } from "express";
import requestHeaders from "../../../constants/requestHeaders.js";

const { allowCredentials } = requestHeaders;

const setHeaderCredentials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header(allowCredentials, "true");

  next();
};

export default setHeaderCredentials;
