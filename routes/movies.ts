import { Router } from 'express'
import { getPopularMovies } from '../controllers/moviesController.js';

const router = Router();
router.get('/popular', getPopularMovies);
export default router;