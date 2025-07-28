import { NextFunction, Request, Response } from "express";

export function verifyUserInformation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { firstName, lastName, userName, email, password } = req.body;
  if (!firstName) {
    res.status(400).send({ message: "firstName is required" });
    return;
  }
  if (!lastName) {
    res.status(400).send({ message: "lastName is required" });
    return;
  }
  if (!email) {
    res.status(400).send({ message: "email is required" });
    return;
  }
  if (!userName) {
    res.status(400).send({ message: "userName is required" });
    return;
  }
  if (!password) {
    res.status(400).send({ message: "password is required" });
    return;
  }
  next();
}