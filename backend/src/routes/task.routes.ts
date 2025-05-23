import { Router } from 'express';
import { getUserTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller';

const router = Router();

router.get('/', getUserTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
