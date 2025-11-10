# 🎵 Playlist API

A TypeScript Express REST API for managing playlists, songs, artists, and albums. Built with SQLite for data persistence.

## ✨ Features

- 🎵 **Songs**: CRUD operations, filter by artist/album
- 🎤 **Artists**: CRUD operations, get with songs and albums
- 💿 **Albums**: CRUD operations, get with artists and songs
- 📝 **Playlists**: CRUD operations, add/remove/reorder songs
- 👤 **Users**: Basic CRUD operations for playlist ownership
- ✅ **Validation**: Comprehensive Zod schema validation on all endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5
- **Database**: SQLite (better-sqlite3)
- **Validation**: Zod for runtime schema validation
- **Dev Tools**: tsx for development with hot reload

## Project Structure

```
playlist-api/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── models/           # (Reserved for future use)
│   ├── db/               # Database setup and migrations
│   ├── types/            # TypeScript type definitions
│   ├── middleware/       # Error handling, etc.
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── data/                 # SQLite database (auto-created)
├── .env                  # Environment variables
└── tsconfig.json         # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (for native --env-file support)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
```bash
cd playlist-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

The `.env` file contains the following configuration options:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `PORT` | Server port number | `3000` |
| `DATABASE_PATH` | Path to SQLite database file | `./data/playlist.db` |
| `NODE_ENV` | Environment mode (development/production) | `development` |

> 💡 **Tip**: In development mode, error responses include detailed error messages. In production, sensitive details are hidden.

4. **Initialize and seed the database:**
```bash
npm run db:seed
```

This will create sample data including users, artists, albums, songs, and playlists. 🎉

### 🏃 Running the Server

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000` 🌐

### 🗄️ Database Commands

```bash
# Initialize empty database (creates schema only)
npm run db:init

# Seed database with sample data (drops existing tables & creates fresh data)
npm run db:seed
```

> ⚠️ **Warning**: `npm run db:seed` will delete all existing data!

## 📡 API Endpoints

### 💚 Health Check

- `GET /health` - Check API status

### 👤 Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### 🎤 Artists

- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get artist with songs and albums
- `POST /api/artists` - Create artist
- `PUT /api/artists/:id` - Update artist
- `DELETE /api/artists/:id` - Delete artist

### 💿 Albums

- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get album with artists and songs
- `POST /api/albums` - Create album
- `PUT /api/albums/:id` - Update album
- `DELETE /api/albums/:id` - Delete album
- `POST /api/albums/:id/artists` - Link artist to album

### 🎵 Songs

- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get song with artists and album
- `GET /api/songs/artist/:artistId` - Get songs by artist
- `GET /api/songs/album/:albumId` - Get songs by album
- `POST /api/songs` - Create song
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song

### 📝 Playlists

- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get playlist with songs
- `GET /api/playlists/user/:userId` - Get playlists by user
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist
- `PUT /api/playlists/:id/songs/:songId/position` - Reorder song

## 🧪 Testing the API

### Option 1: Using Postman (Recommended) 📮

We've included a complete Postman collection with all API endpoints and sample requests!

1. **Import the collection:**
   - Open Postman
   - Click **Import** button
   - Select `postman_collection.json` from the project root
   - The collection will appear in your sidebar

2. **Set up environment variables (optional):**
   - Create a new environment in Postman
   - Add variable: `baseUrl` = `http://localhost:3000`

3. **Start making requests!** 🚀
   - All endpoints are pre-configured with sample data
   - Requests are organized by resource (Users, Artists, Albums, Songs, Playlists)
   - Try the "Health Check" first to verify the server is running

> 💡 **Pro Tip**: The collection includes examples for all CRUD operations, filtering, and relationship management!

### Option 2: Using cURL 💻

#### Create a new artist
```bash
curl -X POST http://localhost:3000/api/artists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Artist",
    "bio": "An amazing musician",
    "image_url": "https://example.com/artist.jpg"
  }'
```

#### Create a new song
```bash
curl -X POST http://localhost:3000/api/songs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Great Song",
    "duration": 240,
    "album_id": 1,
    "artist_ids": [1, 2]
  }'
```

#### Create a playlist
```bash
curl -X POST http://localhost:3000/api/playlists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Awesome Playlist",
    "description": "Best songs ever",
    "user_id": 1,
    "is_public": true
  }'
```

#### Add song to playlist
```bash
curl -X POST http://localhost:3000/api/playlists/1/songs \
  -H "Content-Type: application/json" \
  -d '{
    "song_id": 5,
    "position": 1
  }'
```

#### Get playlist with all songs
```bash
curl http://localhost:3000/api/playlists/1
```

## 🗂️ Database Schema

### Core Tables
- 👤 **users**: User accounts
- 🎤 **artists**: Music artists
- 💿 **albums**: Music albums
- 🎵 **songs**: Individual tracks
- 📝 **playlists**: User-created playlists

### Junction Tables (Many-to-Many Relationships)
- 🔗 **song_artists**: Links songs to artists (many-to-many)
- 🔗 **album_artists**: Links albums to artists (many-to-many)
- 🔗 **playlist_songs**: Links songs to playlists with position ordering

## ⚠️ Error Handling

The API returns appropriate HTTP status codes:
- ✅ `200` - Success
- ✨ `201` - Created
- 🗑️ `204` - No Content (successful deletion)
- ❌ `400` - Bad Request (validation error)
- 🔍 `404` - Not Found
- ⚔️ `409` - Conflict (duplicate entry)
- 💥 `500` - Internal Server Error

Error responses include a JSON body:
```json
{
  "error": "Error message",
  "status": 404
}
```

### Validation Errors

Zod validation provides detailed field-level error messages:
```json
{
  "error": "Validation failed: email: Invalid email format, name: Name is required",
  "status": 400
}
```

## 🛠️ Development

### TypeScript Compilation

```bash
npm run build
```

### Project Configuration

- **TypeScript**: Configured for ES2022 with strict mode
- **Module System**: ES Modules (type: "module")
- **Environment**: Uses Node's native --env-file flag (requires Node 20+)

## 🚀 Future Enhancements

- 🔐 Authentication & authorization
- 🔎 Search functionality
- 📄 Pagination for large datasets
- 📁 File upload for song/image storage
- 📊 Play history tracking
- ❤️ Like/favorite functionality
- 🎸 Genre management
- 🤝 Playlist collaboration features

## 📄 License

ISC
