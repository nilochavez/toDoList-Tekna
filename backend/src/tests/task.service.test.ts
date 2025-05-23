import { TaskService } from '../services/task.service';

describe('TaskService (unit)', () => {
    const mockTask = {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    };

  const mockPrisma = {
    task: mockTask
  } as any;

  const taskService = new TaskService(mockPrisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of tasks for user', async () => {
    const fakeTasks = [
      { id: 1, title: 'Tarefa 1', userId: 1, description: '', dueDate: new Date(), completed: false },
      { id: 2, title: 'Tarefa 2', userId: 1, description: '', dueDate: new Date(), completed: false }
    ];

    mockTask.findMany.mockResolvedValue(fakeTasks);

    const tasks = await taskService.getAllByUserId(1);
    expect(tasks).toHaveLength(2);
    expect(mockTask.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      orderBy: { dueDate: 'asc' }
    });
  });

  it('should create a new task', async () => {
    const newTask = {
      title: 'Nova Tarefa',
      description: 'Teste unitário',
      dueDate: new Date(),
      userId: 1
    };

    const expected = { id: 99, ...newTask };
    mockTask.create.mockResolvedValue(expected);

    const result = await taskService.create(newTask);

    expect(result).toEqual(expected);
    expect(mockTask.create).toHaveBeenCalledWith({ data: newTask });
  });

  it('should update a task if user is authorized', async () => {
    const updateInput = {
      id: 1,
      title: 'Atualizada',
      description: 'Alterado no teste',
      dueDate: new Date(),
      completed: true,
      userId: 42
    };

    mockTask.findUnique.mockResolvedValue({ id: 1, userId: 42 });
    mockTask.update.mockResolvedValue({ ...updateInput });

    const result = await taskService.update(updateInput);

    expect(mockTask.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockTask.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        title: 'Atualizada',
        description: 'Alterado no teste',
        dueDate: updateInput.dueDate,
        completed: true
      }
    });
    expect(result.title).toBe('Atualizada');
  });

  it('should throw when updating a task from another user', async () => {
    mockTask.findUnique.mockResolvedValue({ id: 1, userId: 999 });

    await expect(
      taskService.update({ ...new Date(), id: 1, userId: 42, title: '', description: '', dueDate: new Date(), completed: false })
    ).rejects.toThrow('Task not found or unauthorized.');
  });

  it('should delete a task if user is authorized', async () => {
    mockTask.findUnique.mockResolvedValue({ id: 10, userId: 42 });
    mockTask.delete.mockResolvedValue({ id: 10 });

    const result = await taskService.delete(10, 42);

    expect(mockTask.findUnique).toHaveBeenCalledWith({ where: { id: 10 } });
    expect(mockTask.delete).toHaveBeenCalledWith({ where: { id: 10 } });
    expect(result.id).toBe(10);
  });

  it('should throw when deleting a task from another user', async () => {
    mockTask.findUnique.mockResolvedValue({ id: 10, userId: 999 });

    await expect(taskService.delete(10, 42))
      .rejects
      .toThrow('Task not found or unauthorized.');
  });



});
