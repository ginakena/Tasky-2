import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
   console.log("User from token:", req.user);
  try {
    const userId = req.user?.id;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        dateCreated: "desc",
      },
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// Get a single task
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
    });
    // console.log(task);
    

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

// Update a task (title, description, isCompleted)
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;
    const userId = req.user?.id;

    const task = await prisma.task.findFirst({
      where: { id, userId, isDeleted: false },
    });
    // console.log(task);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        isCompleted,
      },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

// Soft delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const task = await prisma.task.findFirst({
      where: { id, userId, isDeleted: false },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({ message: "Task soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};


//restore Task
export const restoreTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const task = await prisma.task.findFirst({
      where: { id, userId, isDeleted: true },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found or not deleted" });
    }

    const restoredTask = await prisma.task.update({
      where: { id },
      data: { isDeleted: false },
    });

    res.status(200).json(restoredTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to restore task" });
  }
};

//mark as complete
export const markTaskComplete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const task = await prisma.task.findFirst({
      where: { id, userId, isDeleted: false },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { isCompleted: true },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark task as completed" });
  }
};

//mark as incomplete
export const markTaskIncomplete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const task = await prisma.task.findFirst({
      where: { id, userId, isDeleted: false },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { isCompleted: false },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark task as incomplete" });
  }
};


