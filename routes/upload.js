import express from 'express';
import { addUsers } from '../controllers/usersController.js';
const router = express.Router();

router.post('/upload', addUsers);

export default router;