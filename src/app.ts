import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { initializeDatabase } from './db/schema.js';

// Import routes (will be created next)
import songRoutes from './routes/songs.js';
import artistRoutes from './routes/artists.js';
import albumRoutes from './routes/albums.js';
import playlistRoutes from './routes/playlists.js';
import userRoutes from './routes/users.js';

const app = express();

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/songs', songRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/users', userRoutes);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
