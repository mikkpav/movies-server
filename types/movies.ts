export interface TMDBMoviesResponse {
  page: number;
  results: TMDBMovieResponse[];
}

export interface TMDBMovieResponse {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPathSmall: string;
  backdropPathSmall: string;
  posterPathLarge: string;
  backdropPathLarge: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  favorite: boolean;
}

export interface TMDBMovieDetailsResponse extends TMDBMovieResponse {
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  origin_country: string;
  tagline: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  budget: number;
  genres: Genre[];
  homepage: string;
  imdbId: string;
  originCountry: string;
  tagline: string;
}

export interface Favorite {
  movieId: number;
  createdAt: string | null;
}

export interface FavoriteToggleResponse {
  movieId: number;
  action: string;
  createdAt: string | null;
}

export interface TMDBSearchResponse {
  page: number;
  results: TMDBMovieResponse[];
  total_pages: number;
  total_results: number;
}

export interface SearchResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}