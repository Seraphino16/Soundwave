/**
 * @description Entité des Waves
 * @author SoundWave
 */

import { Document, Schema } from 'mongoose';
import { User } from '../../user/entities/user.entity';

export interface Wave extends Document {
  id: number;
  userId: number;
  user?: User;
  content: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  visibility: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const WaveSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  userId: { type: Number, required: true, ref: 'User' },
  content: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },
  visibility: { type: Boolean, default: true },
}, {
  timestamps: true,
});