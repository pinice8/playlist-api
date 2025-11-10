# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
npm run dev          # Development mode with hot reload (tsx watch)
npm run build        # Compile TypeScript to dist/
npm start            # Production mode (requires build first)
```

### Database Management
```bash
npm run db:init      # Initialize empty database with schema
npm run db:seed      # Drop all tables, initialize schema, and seed with sample data
```

The database file is stored at `./data/playlist.db` (configurable via `DATABASE_PATH` env var).

## Architecture Overview

### Technology Stack
- **Runtime**: Node.js 20+ with ES Modules (`type: "module"`)
- **Database**: SQLite with better-sqlite3 (synchronous API, WAL mode enabled)
- **Framework**: Express 5 with TypeScript strict mode
- **Environment**: Uses Node's native `--env-file` flag (not dotenv)

### Request Flow
1. Request enters through `src/server.ts` → `src/app.ts`
2. Routes in `src/routes/*.ts` define endpoints and map to controller functions
3. Controllers in `src/controllers/*.ts` contain all business logic and database queries
4. Database connection is a singleton in `src/db/connection.ts`
5. Errors bubble up to `errorHandler` middleware (must be last in app.ts)

### Database Architecture

**Core Design Pattern**: Many-to-many relationships through junction tables.

**Key Tables**:
- `users`, `artists`, `albums`, `songs`, `playlists` - Core entities
- `song_artists` - Songs have multiple artists, artists have multiple songs
- `album_artists` - Albums have multiple artists (compilation albums, collaborations)
- `playlist_songs` - Playlists contain songs with `position` for ordering

**Important Notes**:
- Foreign keys are enabled: `db.pragma('foreign_keys = ON')`
- Cascade deletes configured (e.g., deleting artist removes song_artists links)
- `album_id` on songs is nullable (SET NULL on album delete)
- Database schema automatically initialized on app startup via `initializeDatabase()`

### TypeScript Types

All types defined in `src/types/models.ts`:
- Base types: `User`, `Artist`, `Album`, `Song`, `Playlist`
- Extended types with relations: `SongWithDetails`, `AlbumWithDetails`, `ArtistWithDetails`, `PlaylistWithDetails`
- DTOs for creation: `CreateUser`, `CreateArtist`, etc.

Controllers return extended types when fetching with relations (e.g., `getPlaylistById` returns `PlaylistWithDetails` with songs and user).

### Error Handling Pattern

Use `ApiError` class for all HTTP errors:
```typescript
import { ApiError } from '../middleware/errorHandler.js';

if (!resource) {
  throw new ApiError(404, 'Resource not found');
}
```

Controllers use try/catch and pass errors to `next(error)` middleware.

### Transaction Pattern

For multi-table operations, use database transactions:
```typescript
const createSong = db.transaction((songData, artistIds) => {
  // Insert song
  const result = db.prepare('INSERT INTO songs...').run(songData);

  // Insert artist relationships
  for (const artistId of artistIds) {
    db.prepare('INSERT INTO song_artists...').run(result.lastInsertRowid, artistId);
  }

  return result.lastInsertRowid;
});

const songId = createSong(data, artists);
```

See `src/controllers/songs.ts` for transaction examples.

## Project Conventions

### Git Commits
Follow Conventional Commits specification:
```
<type>(<scope>): <subject>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`

**Scopes**: `api`, `db`, `songs`, `artists`, `albums`, `playlists`, `users`, `middleware`, `types`, `config`

**Subject**: Imperative, present tense, lowercase, no period, max 72 chars

Examples:
- `feat(playlists): add ability to duplicate playlists`
- `fix(songs): correct duration calculation for songs`
- `refactor(db): optimize query performance for playlist retrieval`

### Code Style
- All database queries go in controllers (not in separate model files)
- Always validate required fields before database operations
- Use `const` over `let` when possible
- Prefer async/await (though better-sqlite3 is synchronous)
- Add comments only for complex logic
- All routes must have `.js` extensions in imports (ES modules requirement)

### REST Conventions
- `GET /api/resources` - List all
- `GET /api/resources/:id` - Get one with details/relations
- `POST /api/resources` - Create (returns 201 with created resource)
- `PUT /api/resources/:id` - Update (full replacement)
- `DELETE /api/resources/:id` - Delete (returns 204 on success)

Special patterns:
- `GET /api/songs/artist/:artistId` - Filter songs by artist
- `POST /api/playlists/:id/songs` - Add song to playlist
- `PUT /api/playlists/:id/songs/:songId/position` - Reorder song in playlist

## Common Development Patterns

### Adding a New Entity
1. Add table to `src/db/schema.ts` in `initializeDatabase()`
2. Add corresponding index if needed
3. Define types in `src/types/models.ts` (base type, extended type, Create DTO)
4. Create controller in `src/controllers/[entity].ts` with CRUD operations
5. Create routes in `src/routes/[entity].ts`
6. Import and mount routes in `src/app.ts`

### Querying with Relations
Use JOIN queries to fetch related data, construct extended types in controllers:
```typescript
const song = db.prepare('SELECT * FROM songs WHERE id = ?').get(id);
const artists = db.prepare(`
  SELECT a.* FROM artists a
  JOIN song_artists sa ON a.id = sa.artist_id
  WHERE sa.song_id = ?
`).all(id);

const songWithDetails: SongWithDetails = { ...song, artists };
```

### Environment Variables
Use `--env-file=.env` flag (not dotenv package). Accessed via `process.env.VARIABLE_NAME`.

Current variables:
- `PORT` - Server port (default: 3000)
- `DATABASE_PATH` - SQLite file location (default: ./data/playlist.db)
- `NODE_ENV` - Environment mode (development shows error details)
