# 🎛 CrowDJ

> 🎵 Democratic music control for hackathons and events through Discord!

## 🌟 Overview

CrowDJ is a Discord bot that democratizes music control at hackathons by letting participants manage a shared Spotify queue. Anyone can add songs, vote to skip tracks, and contribute to the event's musical atmosphere!

## ✨ Features

- 🎼 **Democratic Queue Management**
  - Add songs to the shared Spotify queue via Discord commands
  - Everyone gets a voice in the event's musical backdrop

- 👥 **Community Skip Votes**
  - Initiate skip votes for current tracks
  - Automatic skip when vote threshold is reached
  - Fair and democratic music control

- 📋 **Live Queue Display**
  - See upcoming tracks in a dedicated Discord channel
  - Track who added each song
  - View song durations and queue position

- 🛡️ **Smart Moderation**
  - Basic content filtering
  - Duration limits
  - Keeps the playlist flowing and appropriate

## 🤖 Commands

- `!add [song name/URL]` - Add a song to the queue
- `!skip` - Vote to skip the current track
- `!queue` - Display current playlist
- `!playing` - Show current track info

## 🔧 Technical Stack

- Discord API
- Spotify Web API
- Node.js
- MongoDB (queue/state management)

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/crowdj.git
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

4. Run the bot
```bash
npm start
```

## 🔑 Environment Variables

```
DISCORD_TOKEN=your_discord_bot_token
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

[MIT](https://choosealicense.com/licenses/mit/)

## 🎫 Support

Join our [Discord server](https://discord.gg/crowdj) for help and updates!

---
Made with ❤️ for hackathons worldwide 🌎