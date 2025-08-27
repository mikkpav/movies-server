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

export interface TMDBMovieDetailsResponse {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    vote_count: number;
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