import { Document, Schema } from 'mongoose';

export interface Rating extends Document {
  id: string;
  artist_id: string;
  user_id: number;
  username: string;
  score: number;
  createdAt: Date;
}

export const RatingSchema = new Schema<Rating>(
  {
    artist_id: {
      type: String,
      required: true,
      index: true,
    },
    user_id: {
      type: Number,
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

RatingSchema.index({ artist_id: 1, user_id: 1 }, { unique: true });
