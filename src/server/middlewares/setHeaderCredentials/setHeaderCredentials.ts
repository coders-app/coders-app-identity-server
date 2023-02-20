import type { Request, Response, NextFunction } from "express";

const setHeaderCredentials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header("Access-Control-Allow-Credentials", "true");

  next();
};

export default setHeaderCredentials;
