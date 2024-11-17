import SpotifyWebApi from 'spotify-web-api-node';
import { config } from 'dotenv';
import logger from '../utils/logger.js';

config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN
});

// Refresh token periodically
const refreshAccessToken = async () => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body.access_token);
    logger.info('Spotify access token refreshed');
    
    // Schedule next refresh before token expires
    setTimeout(refreshAccessToken, (data.body.expires_in - 60) * 1000);
  } catch (error) {
    logger.error('Error refreshing Spotify access token:', error);
    throw error;
  }
};

export const initializeSpotify = async () => {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REFRESH_TOKEN) {
    throw new Error('Missing Spotify credentials in environment variables');
  }

  try {
    await refreshAccessToken();
    return spotifyApi;
  } catch (error) {
    logger.error('Failed to initialize Spotify client:', error);
    throw error;
  }
};

export default spotifyApi;