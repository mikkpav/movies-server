import { fetchMovieDetailsForFavorites } from '../services/tmdbService.js';
import type { Request, Response } from 'express';

export async function getFavoriteMovies(request: Request, response: Response) {
    const userId = (request.query.userId as string) || '';
    if (!userId) {
        return response.status(400).json({ error: 'userId required' });
    }

    const movies = await fetchMovieDetailsForFavorites(userId);
    response.json(movies);
}