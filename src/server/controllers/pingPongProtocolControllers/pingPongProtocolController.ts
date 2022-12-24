import type { Request, Response } from "express";

const getPong = (req: Request, res: Response) => {
  res.json({
    message: "Pong 🏓",
  });
};

export default getPong;
