import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";

const prisma = new PrismaClient();

export async function registerUser(req: Request, res: Response) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      avatar = null,
      userName,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        avatar,
        userName,
      },
    });

    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, userName, password } = req.body;

    if ((!email && !userName) || !password) {
      res.status(400).json({
        message: "Please provide the required field",
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const { password: _, ...userData } = user;
    const token = generateToken(userData);

    return res

      .cookie("tasky", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .send({userData, token});
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Failed to login" });
  }
}

export function logoutUser(_req: Request, res: Response) {
  try {
    res.clearCookie("tasky");
    res.status(200).send({ message: "you have successfully logout" });
  } catch (error) {
    res.status(500).send({ message: "failed logging you out" });
  }
}

export async function updatePassword(req: Request, res: Response) {
    try {
        const { id } = req.user;
        const { oldPassword, newPassword} = req.body
        const user = await prisma.user.findUnique({ where: { id}, });
        if (!user) {
            return res.status(400).send ({ message: "User not found"});
        }
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
         if (!isOldPasswordValid) {
      res.status(401).send({
        message: "No match found",
      });
      return;
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
      },
    });
     res.status(200).send({ message: "successfully updated password" });
    } catch (error) {
        console.error("Error updating password:", error)
        res.status(500).send({ message: "Failed to update password" });
    }
          
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const { id } = req.user;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userName: true,
        avatar: true,
        dateJoined: true,
        lastUpdated: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user profile" });
  }
}

export async function updateUserProfile(req: Request, res: Response) {
  try {
    const id = req?.user.id
    const { firstName, lastName, userName, email, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        userName,
        email,
        avatar,
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
}

