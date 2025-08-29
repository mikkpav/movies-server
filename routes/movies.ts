import { Router } from 'express'
import { getMovieDetails, getPopularMovies } from '../controllers/moviesController.js';

const router = Router();
router.get('/popular', getPopularMovies);
router.get('/:movieId', getMovieDetails);
export default router;