import { Router } from 'express';
import { getUserTasks, createTask, updateTask, getTaskById, deleteTask } from '../controllers/task.controller';

const router = Router();

router.get('/', getUserTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
