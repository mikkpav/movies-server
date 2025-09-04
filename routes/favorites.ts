import { Router } from 'express';
import { getFavoriteMovieIds, getFavoriteMovies, toggleFavorite } from '../controllers/favoritesController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/ids', asyncHandler(getFavoriteMovieIds));
router.get('/movies', asyncHandler(getFavoriteMovies));
router.post('/toggle', asyncHandler(toggleFavorite));
export default router;