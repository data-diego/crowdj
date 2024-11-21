import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { registerCommands } from './commands/registerCommands.js';
import { handleCommands } from './handlers/commandHandler.js';
import { handleEvents } from './handlers/eventHandler.js';
import { initializeSpotify } from './services/spotifyClient.js';
import logger from './utils/logger.js';
import connectDB from './config/database.js';

// Load environment variables
config();

// Initialize Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
});

// Error handling
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

// Initialize bot
const initializeBot = async () => {
  try {
    // Initialize Spotify first
    logger.info('Initializing Spotify client...');
    await initializeSpotify();
    logger.info('Spotify client initialized successfully');

    // Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await connectDB();
    
    // Register commands
    await registerCommands();
    
    // Set up command and event handlers
    handleCommands(client);
    handleEvents(client);

    // Login to Discord
    await client.login(process.env.DISCORD_TOKEN);
    logger.info('CrowdJ Bot is online!');
  } catch (error) {
    logger.error('Error initializing bot:', error);
    process.exit(1);
  }
};

initializeBot();