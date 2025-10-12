import { Router } from 'express';
import { getTopHeadlines, getSearchResults } from '../controllers/newsController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/top-headlines', asyncHandler(getTopHeadlines));
router.get('/search', asyncHandler(getSearchResults));

export default router;
