import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['ADD_SONG', 'SKIP_VOTE', 'QUEUE_VIEW', 'NOW_PLAYING_VIEW']
  },
  songInfo: {
    name: String,
    artists: String,
    url: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
},{
  collection: 'actions'
});

export default mongoose.model('Action', actionSchema);