import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import pool, { ensureSchema } from './db/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  app.use(
    cors({
      origin: ['https://mikkpavelson.com/'],
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}
app.use(express.json());

ensureSchema()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.error(err));

// Routes

// Toggle a favorite for a user
app.post('/favorites/toggle', async (req, res) => {
    const { user_id, movie_id } = req.body;
    if (!user_id || !movie_id) {
        return res.status(400).json({ error: 'user_id and movie_id required' });
    }

    try {
        const existingResult = await pool.query(
            `SELECT 1 FROM favorites WHERE user_id = $1 AND movie_id = $2`,
            [user_id, movie_id]
        );
        
        let action;
        let createdAt;

        if (existingResult.rowCount && existingResult.rowCount > 0) {
            await pool.query(
                `DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2`,
                    [user_id, movie_id]
            );
            action = 'removed'
        } else {
            const insertResult = await pool.query(
                `INSERT INTO favorites (user_id, movie_id)
                VALUES ($1, $2)
                RETURNING created_at`,
                [user_id, movie_id]
            );
            action = 'added';
            createdAt = insertResult.rows[0].created_at;
        }

        res.json({ movieId: Number(movie_id), action, createdAt });
    } catch (err) {
        console.error('Error inserting favorite:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all favorites for a user
app.get('/favorites', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id required' });
  }

  try {
    const result = await pool.query(
      `SELECT movie_id, created_at FROM favorites WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );

    const favorites = result.rows.map(row => ({
      movieId: Number(row.movie_id),
      createdAt: row.created_at,
    }));

    res.json(favorites);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Database error' });
  }
});
