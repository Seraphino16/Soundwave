import { Schema, Document } from 'mongoose';

export interface UserInfos extends Document {
  id: number;
  user_id: number;
  profile_picture?: string;
  banner_picture?: string;
  bio?: string;
  location?: string;
  musicStyle?: string[];
  socialLinks?: { [network: string]: string };
  createdAt: Date;
  updatedAt: Date;
}

export const UserInfosSchema = new Schema<UserInfos>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  profile_picture: {
    type: String,
    required: false,
  },
  banner_picture: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  musicStyle: {
    type: [String],
    required: false,
  },
  socialLinks: {
    type: Map,
    of: String,
    required: false,
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
