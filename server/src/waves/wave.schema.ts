import { Document, Schema } from 'mongoose';

export interface Wave extends Document {
  id: string;
  artist_id: string;
  user_id: number;
  username: string;
  profile_picture: string;
  message: string;
  createdAt: Date;
}

export const WaveSchema = new Schema<Wave>(
  {
    artist_id: { type: String, required: true },
    user_id: { type: Number, required: true },
    username: { type: String, required: true },
    profile_picture: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

WaveSchema.index({ artist_id: 1, user_id: 1 }, { unique: true });
