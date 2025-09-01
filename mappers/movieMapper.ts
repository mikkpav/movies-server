import type { TMDBMovieDetailsResponse, MovieDetails, TMDBMovieResponse, Movie, TMDBSearchResponse, SearchResponse } from '../types/movies.js';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const TMDB_POSTER_SIZE_LIST = 'w154';
const TMDB_POSTER_SIZE_DETAIL = 'w500';

function imageUrlSmallForPath(path: string | null): string | null {
    return path ? `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZE_LIST}${path}` : null;
}

function imageUrlLargeForPath(path: string | null): string | null {
    return path ? `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZE_DETAIL}${path}` : null;
}

export function mapMovieDetailsApiResponse(data: TMDBMovieDetailsResponse): MovieDetails {
  return {
        id: data.id,
        overview: data.overview,
        posterPathSmall: imageUrlSmallForPath(data.poster_path),
        backdropPathSmall: imageUrlSmallForPath(data.backdrop_path),
        posterPathLarge: imageUrlLargeForPath(data.poster_path),
        backdropPathLarge: imageUrlLargeForPath(data.backdrop_path),
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

export function mapMovieApiResponse(data: TMDBMovieResponse): Movie {
    return {
        id: data.id,
        overview: data.overview,
        posterPathSmall: imageUrlSmallForPath(data.poster_path),
        backdropPathSmall: imageUrlSmallForPath(data.backdrop_path),
        posterPathLarge: imageUrlLargeForPath(data.poster_path),
        backdropPathLarge: imageUrlLargeForPath(data.backdrop_path),
        releaseDate: data.release_date,
        title: data.title,
        voteAverage: Math.round(data.vote_average * 10) / 10,
        voteCount: data.vote_count,
        favorite: false
    }
}

export function mapMovieSearchResult(data: TMDBSearchResponse): SearchResponse {
    return {
        page: data.page,
        results: data.results.map(mapMovieApiResponse),
        totalPages: data.total_pages,
        totalResults: data.total_results
    }
}