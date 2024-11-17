import logger from '../utils/logger.js';

export const handleEvents = (client) => {
  client.once('ready', () => {
    logger.info(`Logged in as ${client.user.tag}`);
  });

  client.on('error', (error) => {
    logger.error('Discord client error:', error);
  });
};