import { z } from 'zod';

/**
 * Zod validation schemas for request body validation.
 * Used with the validateBody middleware to ensure type safety and data validation.
 */

// ==================== User Validation Schemas ====================

/**
 * Schema for creating a new user.
 * @property {string} name - User's name (1-255 characters)
 * @property {string} email - Valid email address (max 255 characters)
 */
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Invalid email format').max(255, 'Email is too long'),
});

/**
 * Schema for updating an existing user.
 * All fields are optional for partial updates.
 * @property {string} [name] - User's name (1-255 characters)
 * @property {string} [email] - Valid email address (max 255 characters)
 */
export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').max(255, 'Name is too long').optional(),
  email: z.string().email('Invalid email format').max(255, 'Email is too long').optional(),
});

// ==================== Artist Validation Schemas ====================

/**
 * Schema for creating a new artist.
 * @property {string} name - Artist's name (1-255 characters)
 * @property {string} [bio] - Artist biography (max 2000 characters)
 * @property {string} [image_url] - Valid URL to artist image (max 500 characters)
 */
export const createArtistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  bio: z.string().max(2000, 'Bio is too long').optional(),
  image_url: z.string().url('Invalid URL format').max(500, 'URL is too long').optional(),
});

/**
 * Schema for updating an existing artist.
 * All fields are optional for partial updates.
 * @property {string} [name] - Artist's name (1-255 characters)
 * @property {string} [bio] - Artist biography (max 2000 characters)
 * @property {string} [image_url] - Valid URL to artist image (max 500 characters)
 */
export const updateArtistSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').max(255, 'Name is too long').optional(),
  bio: z.string().max(2000, 'Bio is too long').optional(),
  image_url: z.string().url('Invalid URL format').max(500, 'URL is too long').optional(),
});

// ==================== Album Validation Schemas ====================

/**
 * Schema for creating a new album.
 * @property {string} title - Album title (1-255 characters)
 * @property {number} [release_year] - Release year (1900 to current year + 1)
 * @property {string} [cover_art_url] - Valid URL to album cover art (max 500 characters)
 */
export const createAlbumSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  release_year: z.number().int('Release year must be an integer').min(1900, 'Release year too old').max(new Date().getFullYear() + 1, 'Release year cannot be in the future').optional(),
  cover_art_url: z.string().url('Invalid URL format').max(500, 'URL is too long').optional(),
});

/**
 * Schema for updating an existing album.
 * All fields are optional for partial updates.
 * @property {string} [title] - Album title (1-255 characters)
 * @property {number} [release_year] - Release year (1900 to current year + 1)
 * @property {string} [cover_art_url] - Valid URL to album cover art (max 500 characters)
 */
export const updateAlbumSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(255, 'Title is too long').optional(),
  release_year: z.number().int('Release year must be an integer').min(1900, 'Release year too old').max(new Date().getFullYear() + 1, 'Release year cannot be in the future').optional(),
  cover_art_url: z.string().url('Invalid URL format').max(500, 'URL is too long').optional(),
});

/**
 * Schema for linking an artist to an album.
 * @property {number} artist_id - Positive integer ID of the artist
 */
export const addArtistToAlbumSchema = z.object({
  artist_id: z.number().int('Artist ID must be an integer').positive('Artist ID must be positive'),
});

// ==================== Song Validation Schemas ====================

/**
 * Schema for creating a new song.
 * @property {string} title - Song title (1-255 characters)
 * @property {number} duration - Song duration in seconds (positive integer)
 * @property {string} [file_url] - Valid URL to song file (max 500 characters)
 * @property {number} [album_id] - Positive integer ID of the album
 * @property {number[]} artist_ids - Array of positive integer artist IDs (minimum 1 artist required)
 */
export const createSongSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  duration: z.number().int('Duration must be an integer').positive('Duration must be positive'),
  file_url: z.string().url('Invalid URL format').max(500, 'URL is too long').optional(),
  album_id: z.number().int('Album ID must be an integer').positive('Album ID must be positive').optional(),
  artist_ids: z.array(z.number().int('Artist ID must be an integer').positive('Artist ID must be positive')).min(1, 'At least one artist is required'),
});

/**
 * Schema for updating an existing song.
 * All fields are optional for partial updates.
 * @property {string} [title] - Song title (1-255 characters)
 * @property {number} [duration] - Song duration in seconds (positive integer)
 * @property {string} [file_url] - Valid URL to song file (max 500 characters)
 * @property {number|null} [album_id] - Positive integer ID of the album or null to remove
 */
export const updateSongSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(255, 'Title is too long').optional(),
  duration: z.number().int('Duration must be an integer').positive('Duration must be positive').optional(),
  file_url: z.string().url('Invalid URL format').max(500, 'URL is too long').optional(),
  album_id: z.number().int('Album ID must be an integer').positive('Album ID must be positive').nullable().optional(),
});

// ==================== Playlist Validation Schemas ====================

/**
 * Schema for creating a new playlist.
 * @property {string} name - Playlist name (1-255 characters)
 * @property {string} [description] - Playlist description (max 1000 characters)
 * @property {number} user_id - Positive integer ID of the user who owns the playlist
 * @property {boolean} [is_public] - Whether the playlist is public (defaults to true)
 */
export const createPlaylistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  user_id: z.number().int('User ID must be an integer').positive('User ID must be positive'),
  is_public: z.boolean().optional().default(true),
});

/**
 * Schema for updating an existing playlist.
 * All fields are optional for partial updates.
 * @property {string} [name] - Playlist name (1-255 characters)
 * @property {string} [description] - Playlist description (max 1000 characters)
 * @property {boolean} [is_public] - Whether the playlist is public
 */
export const updatePlaylistSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').max(255, 'Name is too long').optional(),
  description: z.string().max(1000, 'Description is too long').optional(),
  is_public: z.boolean().optional(),
});

/**
 * Schema for adding a song to a playlist.
 * @property {number} song_id - Positive integer ID of the song
 * @property {number} [position] - Position in the playlist (positive integer, auto-calculated if not provided)
 */
export const addSongToPlaylistSchema = z.object({
  song_id: z.number().int('Song ID must be an integer').positive('Song ID must be positive'),
  position: z.number().int('Position must be an integer').positive('Position must be positive').optional(),
});

/**
 * Schema for reordering a song in a playlist.
 * @property {number} new_position - New position in the playlist (positive integer)
 */
export const reorderSongSchema = z.object({
  new_position: z.number().int('Position must be an integer').positive('Position must be positive'),
});

// Type exports for TypeScript inference
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateArtistInput = z.infer<typeof createArtistSchema>;
export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;
export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;
export type AddArtistToAlbumInput = z.infer<typeof addArtistToAlbumSchema>;
export type CreateSongInput = z.infer<typeof createSongSchema>;
export type UpdateSongInput = z.infer<typeof updateSongSchema>;
export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;
export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>;
export type AddSongToPlaylistInput = z.infer<typeof addSongToPlaylistSchema>;
export type ReorderSongInput = z.infer<typeof reorderSongSchema>;
