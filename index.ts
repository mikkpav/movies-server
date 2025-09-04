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
import authRoutes from './routes/authentication.js';
import type { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { requireAuth } from './middleware/authenticator.js';

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
app.use('/health', healthRoutes);

//
// User authentication 
//
app.use('/auth', authRoutes);


//
// Get lists and details about movies
//
app.use('/movies', movieRoutes);


//
// Get all favorite movies' details
//

app.use('/favorites', requireAuth, favoritesRoutes);

//
// Generic error handling
//

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);

    if (axios.isAxiosError(err)) {
        return res
            .status(err.response?.status || 502)
            .json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal server error' });
});
