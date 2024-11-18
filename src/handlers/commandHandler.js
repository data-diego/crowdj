import { EmbedBuilder } from 'discord.js';
import logger from '../utils/logger.js';
import { getCurrentlyPlaying, addSongToQueue, getQueue } from '../services/spotifyService.js';

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
    const track = await addSongToQueue(query);

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

const handleQueue = async (interaction) => {
  await interaction.deferReply();

  try {
    const queue = await getQueue();
    
    if (queue.length === 0) {
      await interaction.editReply('The queue is empty.');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('Current Queue')
      .setColor('#1DB954');

    const queueList = queue
      .slice(0, 10) // Limit to first 10 songs
      .map((track, index) => `${index + 1}. [${track.name}](${track.url}) - ${track.artists}`)
      .join('\n');

    embed.setDescription(queueList);

    if (queue.length > 10) {
      embed.setFooter({ text: `And ${queue.length - 10} more songs...` });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    logger.error('Error in queue command:', error);
    await interaction.editReply('Failed to fetch queue.');
  }
};

const commandHandlers = {
  ping: handlePing,
  help: handleHelp,
  nowplaying: handleNowPlaying,
  queue: handleQueue,
  addsong: handleAddSong
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