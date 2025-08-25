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

// Add a favorite
app.post('/favorites', async (req, res) => {
  const { client_id, movie_id } = req.body;
  if (!client_id || !movie_id) {
    return res.status(400).json({ error: 'client_id and movie_id required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO favorites (client_id, movie_id) 
       VALUES ($1, $2)
       ON CONFLICT (client_id, movie_id) DO NOTHING
       RETURNING *`,
      [client_id, movie_id]
    );
    res.json(result.rows[0] || { message: 'Already favorited' });
  } catch (err) {
    console.error('Error inserting favorite:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all favorites for a user
app.get('/favorites', async (req, res) => {
  const { client_id } = req.query;
  if (!client_id) {
    return res.status(400).json({ error: 'client_id required' });
  }

  try {
    const result = await pool.query(
      `SELECT movie_id, created_at FROM favorites WHERE client_id = $1 ORDER BY created_at DESC`,
      [client_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Database error' });
  }
});
