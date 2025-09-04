import { fetchMovieDetailsForFavorites } from '../services/tmdbService.js';
import type { Request, Response } from 'express';
import { pool } from '../db/db.js';

export async function getFavoriteMovieIds(request: Request, response: Response) {
    const { userId } = request.query;
    if (!userId) {
        return response.status(400).json({ error: 'userId required' });
    }

    const result = await pool.query(
        `SELECT movie_id, created_at FROM favorites WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
    );

    const favorites = result.rows.map(row => ({
        movieId: Number(row.movie_id),
        createdAt: row.created_at,
    }));

    response.json(favorites);
}

export async function getFavoriteMovies(request: Request, response: Response) {
    const userId = (request.query.userId as string) || '';
    if (!userId) {
        return response.status(400).json({ error: 'userId required' });
    }

    const movies = await fetchMovieDetailsForFavorites(userId);
    response.json(movies);
}

export async function toggleFavorite(request: Request, response: Response) {
    const { userId, movieId } = request.body;
    if (!userId || !movieId) {
        return response.status(400).json({ error: 'userId and movieId required' });
    }

    const existingResult = await pool.query(
        `SELECT 1 FROM favorites WHERE user_id = $1 AND movie_id = $2`,
        [userId, movieId]
    );
    
    let action;
    let createdAt;

    if (existingResult.rowCount && existingResult.rowCount > 0) {
        await pool.query(
            `DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2`,
                [userId, movieId]
        );
        action = 'removed'
    } else {
        const insertResult = await pool.query(
            `INSERT INTO favorites (user_id, movie_id)
            VALUES ($1, $2)
            RETURNING created_at`,
            [userId, movieId]
        );
        action = 'added';
        createdAt = insertResult.rows[0].created_at;
    }

    response.json({ movieId: Number(movieId), action, createdAt });
}