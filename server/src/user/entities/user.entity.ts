import { Schema, Document } from "mongoose";

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
    roles: string[];
    verification_token?: string;
    is_verified: boolean;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const UserSchema = new Schema<User>({
        id: {
            type: Number,
            required: true,
            unique: true
        },
        pseudo: {
            type: String,
            required: true,
            unique: false
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        birthdate: {
            type: Date,
            required: true,
            unique: false
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: false,
            unique: false
        },
        googleId: {
            type: String,
            required: false,
            unique: true
        },
        twitterId: {
            type: String,
            required: false,
            unique: true
        },
        facebookId: {
            type: String,
            required: false,
            unique: true
        },
        spotifyId: {
            type: String,
            required: false,
            unique: true
        },
        deezerId: {
            type: String,
            required: false,
            unique: true
        },
        roles: {
            type: [String],
            enum: ['USER', 'ADMIN', 'ARTIST', 'BAND'],
            default: ['USER'],
            required: true,
            unique: false
        },
        verification_token: {
            type: String,
            unique: true,
            required: false
        },
        is_verified: {
            type: Boolean,
            default: false,
            required: true
        },
        is_active: {
            type: Boolean,
            default: true,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        updatedAt: {
            type: Date,
            default: Date.now,
            required: true
        }
    },
    {
        timestamps: true
    });

