import { Router } from 'express';
import { getFavoriteMovies } from '../controllers/favoritesController.js';

const router = Router();
router.get('/favorites/movies', getFavoriteMovies);
export default router;