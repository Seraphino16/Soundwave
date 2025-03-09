import { Document, Schema } from 'mongoose';
import { UserRole } from '../../config/user.config';

export interface User extends Document {
  id: number;
  pseudo: string;
  username: string;
  email: string;
  birthdate: Date;
  password: string;
  googleId?: string;
  facebookId?: string;
  twitterId?: string;
  deezerId?: string;
  spotifyId?: string;
  roles: UserRole[];
  verification_token?: string;
  is_verified: boolean;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: number;
  pseudo: string;
  username: string;
  email: string;
  birthdate: Date;
  roles: UserRole[];
  is_verified: boolean;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<User>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    pseudo: {
      type: String,
      required: true,
      unique: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    birthdate: {
      type: Date,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      unique: false,
    },
    googleId: {
      type: String,
      required: false,
    },
    twitterId: {
      type: String,
      required: false,
    },
    facebookId: {
      type: String,
      required: false,
    },
    spotifyId: {
      type: String,
      required: false,
    },
    deezerId: {
      type: String,
      required: false,
    },
    roles: {
      type: [String],
      enum: [UserRole.USER, UserRole.ADMIN, UserRole.ARTIST, UserRole.BAND],
      default: [UserRole.USER],
      required: true,
    },
    verification_token: {
      type: String,
      unique: true,
      required: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index(
  { googleId: 1 },
  { unique: true, partialFilterExpression: { googleId: { $ne: null } } },
);
UserSchema.index(
  { facebookId: 1 },
  { unique: true, partialFilterExpression: { facebookId: { $ne: null } } },
);
UserSchema.index(
  { twitterId: 1 },
  { unique: true, partialFilterExpression: { twitterId: { $ne: null } } },
);
UserSchema.index(
  { spotifyId: 1 },
  { unique: true, partialFilterExpression: { spotifyId: { $ne: null } } },
);
UserSchema.index(
  { deezerId: 1 },
  { unique: true, partialFilterExpression: { deezerId: { $ne: null } } },
);
