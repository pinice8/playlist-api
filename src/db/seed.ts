import db from './connection.js';
import { initializeDatabase, dropAllTables } from './schema.js';

function seedDatabase() {
  console.log('Dropping existing tables...');
  dropAllTables();

  console.log('Creating fresh schema...');
  initializeDatabase();

  console.log('Seeding data...');

  // Insert Users
  const insertUser = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  const users = [
    ['Alice Johnson', 'alice@example.com'],
    ['Bob Smith', 'bob@example.com'],
    ['Charlie Davis', 'charlie@example.com'],
  ];
  users.forEach(user => insertUser.run(...user));
  console.log(`✓ Inserted ${users.length} users`);

  // Insert Artists
  const insertArtist = db.prepare('INSERT INTO artists (name, bio, image_url) VALUES (?, ?, ?)');
  const artists = [
    ['The Midnight', 'Synthwave duo from Los Angeles', 'https://example.com/midnight.jpg'],
    ['Daft Punk', 'French electronic music duo', 'https://example.com/daftpunk.jpg'],
    ['deadmau5', 'Canadian electronic music producer', 'https://example.com/deadmau5.jpg'],
    ['Porter Robinson', 'American DJ and producer', 'https://example.com/porter.jpg'],
    ['ODESZA', 'American electronic music duo', 'https://example.com/odesza.jpg'],
  ];
  artists.forEach(artist => insertArtist.run(...artist));
  console.log(`✓ Inserted ${artists.length} artists`);

  // Insert Albums
  const insertAlbum = db.prepare('INSERT INTO albums (title, release_year, cover_art_url) VALUES (?, ?, ?)');
  const albums = [
    ['Endless Summer', 2016, 'https://example.com/endless-summer.jpg'],
    ['Random Access Memories', 2013, 'https://example.com/ram.jpg'],
    ['For Lack of a Better Name', 2009, 'https://example.com/floan.jpg'],
    ['Nurture', 2021, 'https://example.com/nurture.jpg'],
    ['A Moment Apart', 2017, 'https://example.com/moment-apart.jpg'],
  ];
  albums.forEach(album => insertAlbum.run(...album));
  console.log(`✓ Inserted ${albums.length} albums`);

  // Link Albums to Artists
  const insertAlbumArtist = db.prepare('INSERT INTO album_artists (album_id, artist_id) VALUES (?, ?)');
  const albumArtists = [
    [1, 1], // Endless Summer - The Midnight
    [2, 2], // Random Access Memories - Daft Punk
    [3, 3], // For Lack of a Better Name - deadmau5
    [4, 4], // Nurture - Porter Robinson
    [5, 5], // A Moment Apart - ODESZA
  ];
  albumArtists.forEach(link => insertAlbumArtist.run(...link));
  console.log(`✓ Linked albums to artists`);

  // Insert Songs
  const insertSong = db.prepare('INSERT INTO songs (title, duration, file_url, album_id) VALUES (?, ?, ?, ?)');
  const songs = [
    // The Midnight - Endless Summer
    ['Sunset', 254, 'https://example.com/songs/sunset.mp3', 1],
    ['Synthetic', 271, 'https://example.com/songs/synthetic.mp3', 1],
    ['Endless Summer', 313, 'https://example.com/songs/endless-summer.mp3', 1],

    // Daft Punk - Random Access Memories
    ['Get Lucky', 369, 'https://example.com/songs/get-lucky.mp3', 2],
    ['Instant Crush', 337, 'https://example.com/songs/instant-crush.mp3', 2],
    ['Lose Yourself to Dance', 353, 'https://example.com/songs/lose-yourself.mp3', 2],

    // deadmau5 - For Lack of a Better Name
    ['Ghosts n Stuff', 305, 'https://example.com/songs/ghosts.mp3', 3],
    ['Strobe', 635, 'https://example.com/songs/strobe.mp3', 3],

    // Porter Robinson - Nurture
    ['Get Your Wish', 224, 'https://example.com/songs/get-your-wish.mp3', 4],
    ['Something Comforting', 273, 'https://example.com/songs/something-comforting.mp3', 4],
    ['Mirror', 226, 'https://example.com/songs/mirror.mp3', 4],

    // ODESZA - A Moment Apart
    ['Line of Sight', 262, 'https://example.com/songs/line-of-sight.mp3', 5],
    ['Higher Ground', 254, 'https://example.com/songs/higher-ground.mp3', 5],
    ['Across The Room', 221, 'https://example.com/songs/across-the-room.mp3', 5],
  ];
  songs.forEach(song => insertSong.run(...song));
  console.log(`✓ Inserted ${songs.length} songs`);

  // Link Songs to Artists
  const insertSongArtist = db.prepare('INSERT INTO song_artists (song_id, artist_id) VALUES (?, ?)');
  const songArtists = [
    // The Midnight songs
    [1, 1], [2, 1], [3, 1],
    // Daft Punk songs
    [4, 2], [5, 2], [6, 2],
    // deadmau5 songs
    [7, 3], [8, 3],
    // Porter Robinson songs
    [9, 4], [10, 4], [11, 4],
    // ODESZA songs
    [12, 5], [13, 5], [14, 5],
  ];
  songArtists.forEach(link => insertSongArtist.run(...link));
  console.log(`✓ Linked songs to artists`);

  // Insert Playlists
  const insertPlaylist = db.prepare('INSERT INTO playlists (name, description, user_id, is_public) VALUES (?, ?, ?, ?)');
  const playlists = [
    ['Chill Vibes', 'Relaxing electronic music for studying', 1, 1],
    ['Workout Mix', 'High energy tracks to power through your workout', 1, 1],
    ['Late Night Drive', 'Perfect for those midnight cruises', 2, 1],
    ['My Private Mix', 'Personal favorites', 3, 0],
  ];
  playlists.forEach(playlist => insertPlaylist.run(...playlist));
  console.log(`✓ Inserted ${playlists.length} playlists`);

  // Add Songs to Playlists
  const insertPlaylistSong = db.prepare('INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES (?, ?, ?)');
  const playlistSongs = [
    // Chill Vibes
    [1, 1, 1], [1, 3, 2], [1, 10, 3], [1, 14, 4],
    // Workout Mix
    [2, 4, 1], [2, 6, 2], [2, 7, 3], [2, 13, 4],
    // Late Night Drive
    [3, 1, 1], [3, 2, 2], [3, 8, 3], [3, 11, 4], [3, 12, 5],
    // My Private Mix
    [4, 9, 1], [4, 5, 2], [4, 8, 3],
  ];
  playlistSongs.forEach(link => insertPlaylistSong.run(...link));
  console.log(`✓ Added songs to playlists`);

  console.log('\n✅ Database seeded successfully!');
}

// Run seeding
try {
  seedDatabase();
  process.exit(0);
} catch (error) {
  console.error('Error seeding database:', error);
  process.exit(1);
}
