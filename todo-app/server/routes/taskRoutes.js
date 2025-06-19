import express from 'express';
import { createTask, getTasks, updateTask, deleteTask, shareTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auhtMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', upload.single("file"), createTask);
router.put('/:id', upload.single("file"), updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/share', shareTask);

export default router;
