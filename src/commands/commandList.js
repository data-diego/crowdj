export const commands = [
  {
    name: 'ping',
    description: 'Replies with bot latency',
  },
  {
    name: 'help',
    description: 'Shows available commands',
  },
  {
    name: 'nowplaying',
    description: 'Shows the currently playing song on Spotify'
  },
  {
    name: 'addsong',
    description: 'Adds a song to the playlist',
    options: [{
      name: 'song',
      type: 3, // STRING
      description: 'The song name or Spotify URL to add',
      required: true
    }]
  }
];