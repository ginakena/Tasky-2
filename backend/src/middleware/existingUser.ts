import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkExistingUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, userName } = req.body;
  const existingUser = await prisma.user.findFirst({
    where: { 
        OR: [{email }, {userName}]
    },
  });
  if (existingUser) {
    res
      .status(401)
      .send({ message: "email or username already in use" });
    return;
  }
  next();
}