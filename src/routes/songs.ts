import { Router } from 'express';
import {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  getSongsByArtist,
  getSongsByAlbum,
} from '../controllers/songs.js';
import { validateBody } from '../middleware/validate.js';
import { createSongSchema, updateSongSchema } from '../types/validation.js';

/**
 * Song routes with Zod validation middleware.
 * All POST and PUT routes validate request bodies before reaching controllers.
 *
 * IMPORTANT: Routes are ordered specifically - /artist/:artistId and /album/:albumId
 * must come before /:id to prevent route conflicts.
 */
const router = Router();

// GET /api/songs - Get all songs
router.get('/', getAllSongs);

// GET /api/songs/artist/:artistId - Get songs by artist (must be before /:id)
router.get('/artist/:artistId', getSongsByArtist);

// GET /api/songs/album/:albumId - Get songs by album (must be before /:id)
router.get('/album/:albumId', getSongsByAlbum);

// GET /api/songs/:id - Get song by ID
router.get('/:id', getSongById);

// POST /api/songs - Create new song
router.post('/', validateBody(createSongSchema), createSong);

// PUT /api/songs/:id - Update song
router.put('/:id', validateBody(updateSongSchema), updateSong);

// DELETE /api/songs/:id - Delete song
router.delete('/:id', deleteSong);

export default router;
