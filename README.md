# 🎛 CrowDJ

> 🎵 Democratic music control for hackathons and events through Discord!

## 🌟 Overview

CrowDJ is a Discord bot that democratizes music control at hackathons by letting participants manage a shared Spotify queue. Anyone can add songs, vote to skip tracks, and contribute to the event's musical atmosphere!

## ✨ Features

- 🎼 **Democratic Queue Management**
  - Add songs to the shared Spotify queue via Discord commands
  - Everyone gets a voice in the event's musical backdrop

- 👥 **Community Skip Votes**
  - The bot automatically initiates a skip votation for the current track playing
  - Song skips when vote threshold is reached
  - Fair and democratic music control

- 📋 **Live Queue Display**
  - See upcoming tracks in a dedicated Discord channel
  - Track who added each song
  - View song durations and queue position

- 🛡️ **Smart Moderation**
  - Basic content filtering
  - Allow to add X songs in Y minutes per user
  - Keeps the playlist flowing and appropriate

## 🤖 Commands

- `/help` - Display the list of available commands
- `/nowplaying` - Display the current song
- `/addsong <song>` - Add a song to the queue
- `/queue` - Display the current queue

## 🔧 Technical Stack

- Node.js
- Discord API (`discord.js`)
- Spotify Web API

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/data-diego/crowdj.git
cd crowdj
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your Discord and Spotify API credentials
```

3.1. Get your spotify refresh token
```bash
npm run auth
```
And copy the refresh token to the `.env` file

4. Run the bot
```bash
npm start
```
## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token    # Bot token from Discord Developer Portal
CLIENT_ID=your_discord_client_id        # Application ID from Discord Developer Portal

# Spotify Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id  # Client ID from Spotify Developer Dashboard
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret  # Client Secret from Spotify Developer Dashboard
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback  # Redirect URI used to get the Refresh Token
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token  # Refresh Token from Spotify

# MongoDB Configuration
MONGODB_URI=your_mongodb_uri  # MongoDB URI from MongoDB Atlas

# Other Configuration
API_ENDPOINT=http://localhost:3000/api/nowplaying  # API endpoint if you want to send current track information
```

The `SPOTIFY_REFRESH_TOKEN` is a token that you can get by running the script `npm run auth` and following the instructions of the command line.

It's recommended to have 2 bots, one for development and another for production, to use one or the other put the appropiate env variables at `.env`

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

[MIT](https://choosealicense.com/licenses/mit/)

---
Made with ❤️ for hackathons worldwide 🌎