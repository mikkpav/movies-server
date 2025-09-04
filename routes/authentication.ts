import { Router } from 'express';
import { login, logout, signupNewUser } from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.post('/signup', asyncHandler(signupNewUser));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
export default router;