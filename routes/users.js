import express from 'express';
import { getUsers, addUsers } from '../controllers/usersController.js';
const router = express.Router();

router.get('/users', getUsers);

router.post('/users', addUsers);

export default router;