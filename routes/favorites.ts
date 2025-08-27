import { Router } from 'express';
import { getFavoriteMovies } from '../controllers/favoritesController.js';

const router = Router();
router.get('/movies', getFavoriteMovies);
export default router;