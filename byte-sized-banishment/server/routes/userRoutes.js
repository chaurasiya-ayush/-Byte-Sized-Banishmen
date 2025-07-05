import express from 'express';
import { getDashboardData } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// This route is protected. The `protect` middleware will run first.
// If the token is valid, it will call `getDashboardData`.
router.get('/dashboard', protect, getDashboardData);

export default router;