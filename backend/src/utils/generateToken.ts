import jwt from "jsonwebtoken";
import { UserPayload } from "../types/index";

export function generateToken(user: UserPayload) {
  return jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}