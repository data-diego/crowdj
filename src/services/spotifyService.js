import { SPOTIFY_CONFIG } from '../config/spotify.js';
import spotifyApi from './spotifyClient.js';
import logger from '../utils/logger.js';

export const getCurrentlyPlaying = async () => {
  try {
    const response = await spotifyApi.getMyCurrentPlayingTrack();
    
    if (!response.body || !response.body.item) {
      return null;
    }

    const track = response.body.item;
    return {
      name: track.name,
      artists: track.artists.map(artist => artist.name).join(', '),
      url: track.external_urls.spotify,
      albumArt: track.album.images[0]?.url
    };
  } catch (error) {
    logger.error('Error getting currently playing track:', error);
    throw error;
  }
};

export const addSongToPlaylist = async (query) => {
  try {
    let trackUri;

    // Check if the query is a Spotify URL
    if (query.includes('spotify.com/track/')) {
      trackUri = `spotify:track:${query.split('/track/')[1].split('?')[0]}`;
    } else {
      // Search for the track
      const searchResponse = await spotifyApi.searchTracks(query, { limit: 1 });
      const track = searchResponse.body.tracks.items[0];
      
      if (!track) {
        throw new Error('No tracks found matching the query');
      }
      
      trackUri = track.uri;
    }

    // Add the track to the playlist
    await spotifyApi.addTracksToPlaylist(SPOTIFY_CONFIG.playlistId, [trackUri]);
    
    // Get the track details to return
    const track = await spotifyApi.getTrack(trackUri.split(':')[2]);
    return {
      name: track.body.name,
      artists: track.body.artists.map(artist => artist.name).join(', '),
      url: track.body.external_urls.spotify
    };
  } catch (error) {
    logger.error('Error adding song to playlist:', error);
    throw error;
  }
};