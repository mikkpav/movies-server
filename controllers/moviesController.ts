
import type { Request, Response } from 'express';
import { fetchMovieDetails, fetchMoviesByQuery, fetchPopularMovies } from '../services/tmdbService.js';

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

export async function searchForMovies(request: Request, response: Response) {
    const query = (request.query.query as string) || '';
    if (!query) {
        return response.status(400).json({ error: 'query string required' })
    }

    const movies = await fetchMoviesByQuery(query);
    response.json(movies);
}