import type { Request, Response, NextFunction } from 'express';
import db from '../db/connection.js';
import { ApiError } from '../middleware/errorHandler.js';
import type { Artist, ArtistWithDetails, CreateArtist } from '../types/models.js';

// Get all artists
export function getAllArtists(_req: Request, res: Response, next: NextFunction) {
  try {
    const artists = db.prepare('SELECT * FROM artists ORDER BY name ASC').all() as Artist[];
    res.json(artists);
  } catch (error) {
    next(error);
  }
}

// Get artist by ID with songs and albums
export function getArtistById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const artist = db.prepare('SELECT * FROM artists WHERE id = ?').get(id) as Artist | undefined;

    if (!artist) {
      throw new ApiError(404, 'Artist not found');
    }

    // Get songs by this artist
    const songs = db.prepare(`
      SELECT s.* FROM songs s
      JOIN song_artists sa ON s.id = sa.song_id
      WHERE sa.artist_id = ?
    `).all(id) as any;

    // Get albums by this artist
    const albums = db.prepare(`
      SELECT a.* FROM albums a
      JOIN album_artists aa ON a.id = aa.album_id
      WHERE aa.artist_id = ?
    `).all(id) as any;

    const artistWithDetails: ArtistWithDetails = {
      ...artist,
      songs,
      albums,
    };

    res.json(artistWithDetails);
  } catch (error) {
    next(error);
  }
}

// Create new artist
export function createArtist(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, bio, image_url }: CreateArtist = req.body;

    const insert = db.prepare(
      'INSERT INTO artists (name, bio, image_url) VALUES (?, ?, ?)'
    );

    const result = insert.run(name, bio || null, image_url || null);
    const artistId = result.lastInsertRowid;

    const artist = db.prepare('SELECT * FROM artists WHERE id = ?').get(artistId) as Artist;
    res.status(201).json(artist);
  } catch (error) {
    next(error);
  }
}

// Update artist
export function updateArtist(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, bio, image_url } = req.body;

    const artist = db.prepare('SELECT * FROM artists WHERE id = ?').get(id);
    if (!artist) {
      throw new ApiError(404, 'Artist not found');
    }

    const update = db.prepare(`
      UPDATE artists
      SET name = COALESCE(?, name),
          bio = COALESCE(?, bio),
          image_url = COALESCE(?, image_url)
      WHERE id = ?
    `);

    update.run(name, bio, image_url, id);

    const updatedArtist = db.prepare('SELECT * FROM artists WHERE id = ?').get(id) as Artist;
    res.json(updatedArtist);
  } catch (error) {
    next(error);
  }
}

// Delete artist
export function deleteArtist(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const artist = db.prepare('SELECT * FROM artists WHERE id = ?').get(id);
    if (!artist) {
      throw new ApiError(404, 'Artist not found');
    }

    db.prepare('DELETE FROM artists WHERE id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
