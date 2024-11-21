import Action from '../models/Action.js';
import logger from '../utils/logger.js';

export const trackUserAction = async (userId, username, action, songInfo = null) => {
  try {
    const actionDoc = new Action({
      userId,
      username,
      action,
      songInfo
    });

    await actionDoc.save();
    logger.info(`Tracked action: ${action} by user ${username}`);
  } catch (error) {
    logger.error('Error tracking user action:', error);
    // Don't throw the error to prevent disrupting the main flow
  }
};