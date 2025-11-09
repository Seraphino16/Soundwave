import { Schema, Document } from 'mongoose';

export interface UserSettings extends Document {
  id: number;
  user_id: number;

  theme: 'dark' | 'light';
  profileVisibility: 'public' | 'private';
  language: 'fr' | 'en';

  createdAt: Date;
  updatedAt: Date;
}

export const UserSettingsSchema = new Schema<UserSettings>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'light',
  },
  profileVisibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  language: {
    type: String,
    enum: ['fr', 'en'],
    default: 'fr',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
