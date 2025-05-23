import { Request, Response, RequestHandler } from 'express';
import { TaskService } from '../services/task.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const taskService = new TaskService(prisma);

export const getUserTasks: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const tasks = await taskService.getAllByUserId(userId);

    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTask: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { title, description, dueDate } = req.body;

    if (!title || !description || !dueDate) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    const task = await taskService.create({
      title,
      description,
      dueDate: new Date(dueDate),
      userId,
    });

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const taskId = Number(req.params.id);

    const { title, description, dueDate, completed } = req.body;

    if (!title || !description || !dueDate) {
      res.status(400).json({ message: 'Missing fields.' });
      return;
    }

    const task = await taskService.update({
      id: taskId,
      title,
      description,
      dueDate: new Date(dueDate),
      completed: completed ?? false,
      userId,
    });

    res.status(200).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};



export const deleteTask: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const taskId = Number(req.params.id);

    const deleted = await taskService.delete(taskId, userId);

    res.status(200).json({ message: 'Task deleted successfully', task: deleted });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

