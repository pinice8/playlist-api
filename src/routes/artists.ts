import { Router } from 'express';
import {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
} from '../controllers/artists.js';

const router = Router();

// GET /api/artists - Get all artists
router.get('/', getAllArtists);

// GET /api/artists/:id - Get artist by ID with songs and albums
router.get('/:id', getArtistById);

// POST /api/artists - Create new artist
router.post('/', createArtist);

// PUT /api/artists/:id - Update artist
router.put('/:id', updateArtist);

// DELETE /api/artists/:id - Delete artist
router.delete('/:id', deleteArtist);

export default router;
