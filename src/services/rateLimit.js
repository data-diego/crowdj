import Action from '../models/Action.js';
import logger from '../utils/logger.js';

export const RATE_LIMITS = {
  SONGS_LIMIT: 2,
  TIME_WINDOW: 10
};

export const checkRateLimit = async (userId) => {
  try {
    const timeWindow = new Date(Date.now() - RATE_LIMITS.TIME_WINDOW * 60 * 1000);
    
    const recentActions = await Action.find({
      userId,
      action: 'ADD_SONG',
      timestamp: { $gte: timeWindow }
    }).sort({ timestamp: 1 }).limit(1);

    const songCount = await Action.countDocuments({
      userId,
      action: 'ADD_SONG',
      timestamp: { $gte: timeWindow }
    });

    const remaining = RATE_LIMITS.SONGS_LIMIT - songCount;
    const isAllowed = remaining > 0;
    
    const resetTime = recentActions.length > 0
      ? new Date(recentActions[0].timestamp).getTime() + (RATE_LIMITS.TIME_WINDOW * 60 * 1000)
      : Date.now();

    return {
      isAllowed,
      remaining,
      resetTime
    };
  } catch (error) {
    logger.error('Error checking rate limit:', error);
    throw new Error('Failed to check rate limit');
  }
};

export const formatRateLimitResponse = (rateLimit) => {
  const resetInSeconds = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
  const minutes = Math.floor(resetInSeconds / 60);
  const seconds = resetInSeconds % 60;
  const timeRemaining = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  if (!rateLimit.isAllowed) {
    return `You've reached the limit of ${RATE_LIMITS.SONGS_LIMIT} songs per ${RATE_LIMITS.TIME_WINDOW} minutes. Please try again in ${timeRemaining}.`;
  }
  
  return `You have ${rateLimit.remaining} song${rateLimit.remaining !== 1 ? 's' : ''} remaining in the current time window.`;
};