import { PrismaClient } from '@prisma/client';


type TaskInput = {
  title: string;
  description: string;
  dueDate: Date;
  userId: number;
};

type UpdateTaskInput = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  userId: number;
};

export class TaskService {

  constructor(private prisma: PrismaClient) {}

  async getAllByUserId(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { dueDate: 'asc' },
    });
  }

  async create(data: TaskInput) {
    return this.prisma.task.create({ data });
  }


  async update(data: UpdateTaskInput) {
    const existingTask = await this.prisma.task.findUnique({
      where: { id: data.id },
    });

    if (!existingTask || existingTask.userId !== data.userId) {
      throw new Error('Task not found or unauthorized.');
    }

    return this.prisma.task.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        completed: data.completed,
      },
    });
  }


    async delete(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized.');
    }

    return this.prisma.task.delete({ where: { id } });
  }

  async getById(id: number, userId: number) {
  const task = await this.prisma.task.findUnique({
    where: { id },
  });

  if (!task || task.userId !== userId) {
    throw new Error('Task not found or unauthorized.');
  }

  return task;
}


  
}



