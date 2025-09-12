import { Document, Schema } from 'mongoose';

export interface Rating extends Document {
  id: number;
  artistId: string;
  userId: number;
  username: string;
  score: number;
  createdAt: Date;
}

export const RatingSchema = new Schema<Rating>(
  {
    id: { type: Number, required: true, unique: true },
    artistId: { type: String, required: true },
    userId: { type: Number, required: true },
    username: { type: String, required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
