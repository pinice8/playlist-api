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

const router = Router();

// GET /api/songs - Get all songs
router.get('/', getAllSongs);

// GET /api/songs/:id - Get song by ID
router.get('/:id', getSongById);

// POST /api/songs - Create new song
router.post('/', createSong);

// PUT /api/songs/:id - Update song
router.put('/:id', updateSong);

// DELETE /api/songs/:id - Delete song
router.delete('/:id', deleteSong);

// GET /api/songs/artist/:artistId - Get songs by artist
router.get('/artist/:artistId', getSongsByArtist);

// GET /api/songs/album/:albumId - Get songs by album
router.get('/album/:albumId', getSongsByAlbum);

export default router;
