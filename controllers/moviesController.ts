
import type { Request, Response } from 'express';
import { fetchMovieDetails, fetchPopularMovies } from '../services/tmdbService.js';

export async function getPopularMovies(request: Request, response: Response) {
    const movies = await fetchPopularMovies();
    response.json(movies);
}

export async function getMovieDetails(request: Request, response: Response) {
    const movieId = (request.params.movieId as string) || '';
    if (!movieId) {
        return response.status(400).json({ error: 'movieId required'});
    }

    const movie = await fetchMovieDetails(movieId);
    response.json(movie);
}