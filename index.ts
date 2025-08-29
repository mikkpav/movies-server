import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import pool, { ensureSchema } from './db/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

import favoritesRoutes from './routes/favorites.js';
import movieRoutes from './routes/movies.js';
import healthRoutes from './routes/health.js';

if (process.env.NODE_ENV === 'production') {
  app.use(
    cors({
      origin: ['https://mikkpavelson.com'],
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


/** Routes **/

//
// Health check and ping via UptimeRobot
//
app.use('/health', healthRoutes)


//
// Get lists and details about movies
//
app.use('/movies', movieRoutes)


//
// Get all favorite movies' details
//

app.use('/favorites', favoritesRoutes);

//
// Toggle a favorite for a user and a movie
//

app.post('/favorites/toggle', async (request, response) => {
    const { userId, movieId } = request.body;
    if (!userId || !movieId) {
        return response.status(400).json({ error: 'userId and movieId required' });
    }

    try {
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
    } catch (err) {
        console.error('Error inserting favorite:', err);
        response.status(500).json({ error: 'Database error' });
    }
});

//
// Get all favorite movie ID's for a user
//
app.get('/favorites', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  try {
    const result = await pool.query(
      `SELECT movie_id, created_at FROM favorites WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
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
