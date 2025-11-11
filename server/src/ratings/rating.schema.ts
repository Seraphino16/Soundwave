import { Document, Schema } from 'mongoose';

export interface Rating extends Document {
  id: string;
  target_type: 'artist' | 'album';
  target_id: string;
  user_id: number;
  username: string;
  score: number;
  createdAt: Date;
}

export const RatingSchema = new Schema<Rating>(
  {
    target_type: {
      type: String,
      enum: ['artist', 'album'],
      required: true,
      index: true,
    },
    target_id: {
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

RatingSchema.index(
  { target_type: 1, target_id: 1, user_id: 1 },
  { unique: true },
);
