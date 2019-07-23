import mongoose from 'mongoose';

const UserSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String
    },
    sessionStart: {
      type: Date,
      default: Date.now()
    },
    sessionFinish: {
      type: Date,
      default: ''
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false }
);

export const UserSession = mongoose.model('UserSession', UserSessionSchema);
