import { EmbedBuilder } from 'discord.js';
import logger from '../utils/logger.js';
import { getCurrentlyPlaying, addSongToQueue, getQueue, searchTracks } from '../services/spotifyService.js';

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

const NUMBER_EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

const handleAddSong = async (interaction) => {
  await interaction.deferReply();

  try {
    const query = interaction.options.getString('song');
    const tracks = await searchTracks(query);

    const embed = new EmbedBuilder()
      .setTitle('Select a Song')
      .setDescription(
        tracks.map((track, i) => 
          `${NUMBER_EMOJIS[i]} [${track.name}](${track.url})\nby ${track.artists} • ${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`
        ).join('\n\n')
      )
      .setColor('#1DB954')
      .setFooter({ text: 'React with a number to select a song' });

    const message = await interaction.editReply({ embeds: [embed] });
    
    // Add reaction numbers
    try {
      for (const emoji of NUMBER_EMOJIS) {
        await message.react(emoji);
      }
    } catch (error) {
      logger.error('Error adding reactions:', error);
      await interaction.editReply('Failed to add reaction buttons. Please try again.');
      return;
    }

    // Create reaction collector
    const filter = (reaction, user) => {
      return NUMBER_EMOJIS.includes(reaction.emoji.name) && user.id === interaction.user.id;
    };

    const collector = message.createReactionCollector({ 
      filter, 
      time: 30000, 
      max: 1,
      dispose: true 
    });

    collector.on('collect', async (reaction) => {
      try {
        const selectedIndex = NUMBER_EMOJIS.indexOf(reaction.emoji.name);
        const selectedTrack = tracks[selectedIndex];

        const addedTrack = await addSongToQueue(selectedTrack.uri);

        const successEmbed = new EmbedBuilder()
          .setTitle('Song Added to Queue')
          .setDescription(`Added [${addedTrack.name}](${addedTrack.url})\nby ${addedTrack.artists}`)
          .setColor('#1DB954');

        if (addedTrack.albumArt) {
          successEmbed.setThumbnail(addedTrack.albumArt);
        }

        await interaction.editReply({ embeds: [successEmbed] });
      } catch (error) {
        logger.error('Error processing song selection:', error);
        await interaction.editReply('Failed to add the selected song to the queue. Please try again.');
      }
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        const timeoutEmbed = new EmbedBuilder()
          .setTitle('Selection Timed Out')
          .setDescription('No song was selected within 30 seconds.')
          .setColor('#FF0000');
        
        await interaction.editReply({ embeds: [timeoutEmbed] });
      }
    });

  } catch (error) {
    logger.error('Error in addsong command:', error);
    await interaction.editReply('Failed to search for songs. Please try again.');
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