export const SPOTIFY_CONFIG = {
    playlistId: process.env.SPOTIFY_PLAYLIST_ID,
    scopes: [
      'playlist-modify-public',
      'playlist-modify-private',
      'user-read-currently-playing',
      'user-read-playback-state'
    ]
  };
