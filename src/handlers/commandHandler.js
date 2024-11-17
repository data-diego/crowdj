import { EmbedBuilder } from 'discord.js';
import logger from '../utils/logger.js';
import { getCurrentlyPlaying, addSongToPlaylist } from '../services/spotifyService.js';

const handlePing = async (interaction) => {
  const latency = Math.round(interaction.client.ws.ping);
  await interaction.reply(`Pong! Latency is ${latency}ms.`);
};

const handleHelp = async (interaction) => {
  await interaction.reply({
    content: `Available commands:
/ping - Check bot latency
/help - Show this message
/nowplaying - Show currently playing song
/addsong <song> - Add a song to the playlist`,
    ephemeral: true
  });
};

const handleNowPlaying = async (interaction) => {
  await interaction.deferReply();

  try {
    const currentTrack = await getCurrentlyPlaying();
    
    if (!currentTrack) {
      await interaction.editReply('No track is currently playing.');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('Now Playing')
      .setDescription(`[${currentTrack.name}](${currentTrack.url})\nby ${currentTrack.artists}`)
      .setColor('#1DB954'); // Spotify green

    if (currentTrack.albumArt) {
      embed.setThumbnail(currentTrack.albumArt);
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    logger.error('Error in nowplaying command:', error);
    await interaction.editReply('Failed to fetch currently playing track.');
  }
};

const handleAddSong = async (interaction) => {
  await interaction.deferReply();

  try {
    const query = interaction.options.getString('song');
    const track = await addSongToPlaylist(query);

    const embed = new EmbedBuilder()
      .setTitle('Song Added to Playlist')
      .setDescription(`Added [${track.name}](${track.url})\nby ${track.artists}`)
      .setColor('#1DB954');

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    logger.error('Error in addsong command:', error);
    await interaction.editReply('Failed to add song to playlist. Make sure the song exists on Spotify.');
  }
};

const commandHandlers = {
  ping: handlePing,
  help: handleHelp,
  nowplaying: handleNowPlaying,
  addsong: handleAddSong,
};

export const handleCommands = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const handler = commandHandlers[interaction.commandName];
    
    if (!handler) {
      logger.warn(`No handler found for command: ${interaction.commandName}`);
      return;
    }

    try {
      await handler(interaction);
    } catch (error) {
      logger.error(`Error executing command ${interaction.commandName}:`, error);
      await interaction.reply({
        content: 'There was an error executing this command.',
        ephemeral: true
      });
    }
  });
};