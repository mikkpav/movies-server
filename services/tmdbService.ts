import axios from 'axios';
import pool from '../db/db.js';
import type { TMDBMovieDetailsResponse, MovieDetails, TMDBMoviesResponse } from '../types/movies.js';
import { mapMovieApiResponse, mapMovieDetailsApiResponse } from '../mappers/movieMapper.js';

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
    }
});

tmdbClient.interceptors.request.use(config => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('TMDB request:', config.method?.toUpperCase(), fullUrl, config.params || config.data || {});
    return config;
});

export async function fetchPopularMovies() {
    const { data } = await tmdbClient.get<TMDBMoviesResponse>('/movie/popular')
    return data.results.map(mapMovieApiResponse);
}

export async function fetchMovieDetails(movieId: string): Promise<MovieDetails> {
    const response = await tmdbClient.get<TMDBMovieDetailsResponse>(`/movie/${movieId}`);
    return mapMovieDetailsApiResponse(response.data);
}

export async function fetchMovieDetailsForFavorites(userId: string) {
    try {
        const { rows } = await pool.query(
            `SELECT movie_id FROM favorites WHERE user_id = $1`,
            [userId]
        );
        const favoriteIds = rows.map(r => r.movie_id);

        const movieDetails: MovieDetails[] = await Promise.all(
            favoriteIds.map(id => fetchMovieDetails(id))
        );

        return movieDetails
    } catch (error) {
        console.error('Error fetching favorites from DB:', error);
        throw error;
    }
}