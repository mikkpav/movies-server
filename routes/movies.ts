import { Router } from 'express'
import { getMovieDetails, getPopularMovies, searchForMovies } from '../controllers/moviesController.js';

const router = Router();
router.get('/popular', getPopularMovies);
router.get('/details/:movieId', getMovieDetails);
router.get('/search', searchForMovies);
export default router;