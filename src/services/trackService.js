import fetch from 'node-fetch';
import Action from '../models/Action.js';
import logger from '../utils/logger.js';

export const findUserWhoAddedTrack = async (trackName) => {
  try {
    const action = await Action.findOne({
      'action': 'ADD_SONG',
      'songInfo.name': trackName
    }).sort({ timestamp: -1 });
    
    return action ? action.username : null;
  } catch (error) {
    logger.error('Error finding user who added track:', error);
    return null;
  }
};

export const postTrackChange = async (track, addedBy) => {
  try {    
    const trackData = {
      eventId: process.env.API_EVENT_ID,
      name: track.name,
      artists: track.artists,
      url: track.url,
      albumArt: track.albumArt,
      addedBy: addedBy || '',
      timestamp: new Date().toISOString()
    };

    const response = await fetch(process.env.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    logger.info('Track change posted successfully:', track.name);
  } catch (error) {
    logger.error('Error posting track change:', error);
  }
};