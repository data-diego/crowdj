import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import { config } from 'dotenv';
import { SPOTIFY_CONFIG } from '../config/spotify.js';

config();

const app = express();
const port = 8888;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `http://localhost:${port}/callback`
});

app.get('/login', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(SPOTIFY_CONFIG.scopes, 'state');
  res.redirect(authorizeURL);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    console.log('\n=== Tokens ===');
    console.log('Access Token:', data.body['access_token']);
    console.log('\nRefresh Token:', data.body['refresh_token']);
    console.log('\nStore the refresh token in your .env file as SPOTIFY_REFRESH_TOKEN');
    
    res.send('Success! Check your console for the tokens. You can close this window.');
    
    // Exit after 5 seconds
    setTimeout(() => process.exit(0), 5000);
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.send('Error getting tokens. Check your console.');
  }
});

app.listen(port, () => {
  console.log(`\n=== Spotify Authentication ===`);
  console.log(`1. Make sure your Spotify Developer Dashboard has http://localhost:${port}/callback as a redirect URI`);
  console.log(`2. Open http://localhost:${port}/login in your browser`);
  console.log(`3. Log in with your Spotify account`);
  console.log(`4. Copy the refresh token from the console\n`);
});