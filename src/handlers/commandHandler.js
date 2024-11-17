import logger from '../utils/logger.js';

const handlePing = async (interaction) => {
  const latency = Math.round(interaction.client.ws.ping);
  await interaction.reply(`Pong! Latency is ${latency}ms.`);
};

const handleHelp = async (interaction) => {
  await interaction.reply({
    content: 'Available commands:\n/ping - Check bot latency\n/help - Show this message',
    ephemeral: true
  });
};

const commandHandlers = {
  ping: handlePing,
  help: handleHelp,
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
