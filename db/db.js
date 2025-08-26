// db.js
import { Pool } from 'pg';

// Create a new pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Optional: test connection on startup
pool
  .connect()
  .then((client) => {
    console.log('✅ Connected to PostgreSQL');
    client.release();
  })
  .catch((err) => console.error('❌ PostgreSQL connection error', err.stack));

/**
 * Ensures the "favorites" table exists.
 * Creates table if it doesn't exist yet.
 */
export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      movie_id INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, movie_id)
    );
  `);
  console.log('✅ Database schema ensured');
}

export default pool;
