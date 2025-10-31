import { Document, Schema } from 'mongoose';

export interface Review extends Document {
  id: string;
  target_type: 'artist' | 'album';
  target_id: string;
  user_id: number;
  username: string;
  profile_picture: string;
  message: string;
  createdAt: Date;
}

export const ReviewSchema = new Schema<Review>(
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
    profile_picture: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

ReviewSchema.index(
  { target_type: 1, target_id: 1, user_id: 1 },
  { unique: true }
);
