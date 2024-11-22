import logger from '../utils/logger.js';
import { getCurrentlyPlaying, skipToNext } from '../services/spotifyService.js';
import { EmbedBuilder } from 'discord.js';
import { postTrackChange } from '../services/trackService.js';

let lastTrackId = null;
let checkInterval = null;
let currentNowPlayingMessage = null;

// Voting configuration
const VOTE_WEIGHTS = {
  '😍': 2,   // Love it
  '👍': 1,   // Like it
  '👎': -1,  // Dislike it
  '🤮': -2   // Hate it
};

const SKIP_THRESHOLD = -3; // Adjust this value based on your needs
const REACTIONS = Object.keys(VOTE_WEIGHTS);

const createNowPlayingEmbed = (track) => {
  return new EmbedBuilder()
    .setColor(0x1DB954)
    .setTitle('Now Playing 🎵')
    .setDescription(`[${track.name}](${track.url})\nby ${track.artists}\n\nReact to vote:\n😍 Love it (+2)\t👍 Like it (+1)\t👎 Dislike it (-1)\t🤮 Hate it (-2)`)
    .setThumbnail(track.albumArt)
    .setFooter({ text: `Skip threshold: ${SKIP_THRESHOLD}` })
};

const calculateVoteScore = async (message) => {
  let score = 0;
  
  for (const reaction of message.reactions.cache.values()) {
    const weight = VOTE_WEIGHTS[reaction.emoji.name];
    if (weight) {
      // Subtract 1 from count to exclude bot's reaction
      const userVotes = reaction.count - 1;
      score += userVotes * weight;
    }
  }
  
  return score;
};

const handleVoting = async (message) => {
  const score = await calculateVoteScore(message);
  logger.info(`Current vote score: ${score}`);
  
  if (score <= SKIP_THRESHOLD) {
    try {
      await skipToNext();
      await message.channel.send('⏭️ Song skipped due to community vote!');
      // Current message will be replaced by new now playing message
    } catch (error) {
      logger.error('Error skipping track:', error);
      await message.channel.send('❌ Failed to skip track. Please try again later.');
    }
  }
};

const addReactionControls = async (message) => {
  // Add reactions in sequence
  for (const reaction of REACTIONS) {
    await message.react(reaction);
  }
};

const checkCurrentTrack = async (client) => {
  try {
    const currentTrack = await getCurrentlyPlaying();
    
    if (!currentTrack) {
      return;
    }
    
    
    const trackId = `${currentTrack.name}-${currentTrack.artists}`;
    
    if (trackId !== lastTrackId) {
      lastTrackId = trackId;
      await postTrackChange(currentTrack);

      // Send the now playing message to all guilds
      client.guilds.cache.forEach(async (guild) => {
        const embed = createNowPlayingEmbed(currentTrack);
        const channel = guild.channels.cache.find(
          channel => channel.type === 0 && 
          channel.name.toLowerCase() === 'crowdj' &&
          channel.permissionsFor(client.user).has('SendMessages')
        );
        
        if (channel) {
          const message = await channel.send({ embeds: [embed] });
          currentNowPlayingMessage = message;
          await addReactionControls(message);
          
          // Create reaction collectors
          const collector = message.createReactionCollector({
            time: 12 * 60 * 60 * 1000 // 12 hours
          });

          collector.on('collect', async (reaction, user) => {
            if (user.bot) return;
            if (!REACTIONS.includes(reaction.emoji.name)) {
              // Remove invalid reactions
              try {
                await reaction.users.remove(user);
              } catch (error) {
                logger.warn('Could not remove invalid reaction:', error);
              }
              return;
            }
            
            await handleVoting(message);
          });

          collector.on('remove', async (reaction, user) => {
            if (user.bot) return;
            await handleVoting(message);
          });
        }
      });
    }
  } catch (error) {
    logger.error('Error checking current track:', error);
  }
};

export const handleEvents = (client) => {
  client.once('ready', () => {
    logger.info(`Logged in as ${client.user.tag}`);
    checkInterval = setInterval(() => checkCurrentTrack(client), 5000);
  });

  client.on('error', (error) => {
    logger.error('Discord client error:', error);
  });

  client.on('disconnect', () => {
    if (checkInterval) {
      clearInterval(checkInterval);
    }
  });
};