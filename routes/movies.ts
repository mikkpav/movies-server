import { Router } from 'express'
import { getMovieDetails, getPopularMovies, searchForMovies } from '../controllers/moviesController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/popular', asyncHandler(getPopularMovies));
router.get('/details/:movieId', asyncHandler(getMovieDetails));
router.get('/search', asyncHandler(searchForMovies));
export default router;