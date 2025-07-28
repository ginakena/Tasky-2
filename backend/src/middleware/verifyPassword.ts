import { NextFunction, Request, Response } from "express";
import zxcvbn from "zxcvbn";

export function verifyPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { password } = req.body;
  const result = zxcvbn(password);

  if (result.score < 3) {
    res.status(401).send({ message: "please choose a stronger password" });
    return;
  }
  next();
}