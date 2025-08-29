import axios from 'axios';
import pool from '../db/db.js';
import type { TMDBMovieDetailsResponse, MovieDetails, TMDBMoviesResponse, TMDBMovieResponse, Movie } from '../types/movies.js';

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const TMDB_POSTER_SIZE_LIST = 'w154';
const TMDB_POSTER_SIZE_DETAIL = 'w500';

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

export async function fetchMovieDetails(movieId: string): Promise<MovieDetails> {
    const response = await tmdbClient.get<TMDBMovieDetailsResponse>(`/movie/${movieId}`);
    return mapMovieDetailsApiResponse(response.data);
}

function mapMovieDetailsApiResponse(data: TMDBMovieDetailsResponse): MovieDetails {
  return {
        id: data.id,
        overview: data.overview,
        posterPathSmall: `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZE_LIST}${data.poster_path}`,
        backdropPathSmall: `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZE_LIST}${data.backdrop_path}`,
        posterPathLarge: `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZE_DETAIL}${data.poster_path}`,
        backdropPathLarge: `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZE_DETAIL}${data.backdrop_path}`,
        releaseDate: data.release_date,
        title: data.title,
        voteAverage: Math.round(data.vote_average * 10) / 10,
        voteCount: data.vote_count,
        budget: data.budget,
        genres: data.genres,
        homepage: data.homepage,
        imdbId: data.imdb_id,
        originCountry: data.origin_country,
        tagline: data.tagline,
        favorite: false
    }
}

export async function fetchPopularMovies() {
    const { data } = await tmdbClient.get<TMDBMoviesResponse>('/movie/popular')
    return data.results.map(mapMovieApiResponse);
}

function mapMovieApiResponse(data: TMDBMovieResponse): Movie {
    return {
        id: data.id,
        overview: data.overview,
        posterPathSmall: `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZE_LIST}${data.poster_path}`,
        backdropPathSmall: `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZE_LIST}${data.backdrop_path}`,
        posterPathLarge: `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZE_DETAIL}${data.poster_path}`,
        backdropPathLarge: `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZE_DETAIL}${data.backdrop_path}`,
        releaseDate: data.release_date,
        title: data.title,
        voteAverage: Math.round(data.vote_average * 10) / 10,
        voteCount: data.vote_count,
        favorite: false
    }
}