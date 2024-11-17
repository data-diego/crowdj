import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { commands } from './commandList.js';
import logger from '../utils/logger.js';

config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

export const registerCommands = async () => {
  try {
    logger.info('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    logger.info('Successfully reloaded application (/) commands.');
  } catch (error) {
    logger.error('Error registering commands:', error);
    throw error;
  }
};