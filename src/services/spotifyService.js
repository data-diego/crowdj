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
export const getQueue = async () => {
  try {
    const response = await spotifyApi.getQueue();
    
    if (!response.body) {
      return {
        currentTrack: null,
        queue: []
      };
    }

    const formatTrack = (track) => ({
      name: track.name,
      artists: track.artists.map(artist => artist.name).join(', '), 
      url: track.external_urls.spotify,
      albumArt: track.album.images[0]?.url,
      uri: track.uri
    });

    const currentTrack = response.body.currently_playing ?
      formatTrack(response.body.currently_playing) : null;

    const queue = (response.body.queue || []).map(formatTrack);

    const allTracks = [currentTrack, ...queue];
    const uniqueTracks = [...new Map(allTracks.filter(Boolean).map(track => [track.uri, track])).values()];

    return uniqueTracks;

  } catch (error) {
    logger.error('Error getting queue:', error);
    throw error;
  }
};

export const searchTracks = async (query) => {
  try {
    const response = await spotifyApi.searchTracks(query, { limit: 3 });
    
    if (!response.body.tracks.items.length) {
      throw new Error('No tracks found matching the query');
    }

    return response.body.tracks.items.map(track => ({
      name: track.name,
      artists: track.artists.map(artist => artist.name).join(', '),
      url: track.external_urls.spotify,
      albumArt: track.album.images[0]?.url,
      uri: track.uri,
      duration: Math.floor(track.duration_ms / 1000) // Convert to seconds
    }));
  } catch (error) {
    logger.error('Error searching tracks:', error);
    throw error;
  }
};

export const addSongToQueue = async (trackUri) => {
  try {
    await spotifyApi.addToQueue(trackUri);
    
    const track = await spotifyApi.getTrack(trackUri.split(':')[2]);
    return {
      name: track.body.name,
      artists: track.body.artists.map(artist => artist.name).join(', '),
      url: track.body.external_urls.spotify,
      albumArt: track.body.album.images[0]?.url
    };
  } catch (error) {
    logger.error('Error adding song to queue:', error);
    throw error;
  }
};

export const skipToNext = async () => {
  try {
    await spotifyApi.skipToNext();
    logger.info('Skipped to next track');
  } catch (error) {
    logger.error('Error skipping to next track:', error);
    throw error;
  }
};