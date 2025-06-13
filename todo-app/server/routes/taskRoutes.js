import express from 'express';
import { createTask, getTasks, updateTask, deleteTask, shareTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auhtMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/share', shareTask);

export default router;
