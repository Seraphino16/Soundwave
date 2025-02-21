import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async setId(): Promise<number> {
        const lastUser = await this.userModel.findOne().sort({ id: -1 }).exec();
        return lastUser ? lastUser.id + 1 : 1;
    }

    async create(
        id: number,
        email: string,
        password: string,
        pseudo: string,
        username: string,
        birthdate: Date,
        googleId?: string,
        facebookId?: string,
        twitterId?: string,
        deezerId?: string,
        spotifyId?: string,
        roles: string[] = ['USER'],
        verification_token?: string,
        is_verified: boolean = false,
        is_active: boolean = true
    ): Promise<User> {
        const newUser = new this.userModel({
            id,
            email,
            password,
            pseudo,
            username,
            birthdate,
            googleId,
            facebookId,
            twitterId,
            deezerId,
            spotifyId,
            roles,
            verification_token,
            is_verified,
            is_active,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return newUser.save();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }
    async findByUsername(username: string): Promise<User | null> {
        return this.userModel.findOne({ username }).exec();
    }
    async findById(id: number): Promise<User | null> {
        return this.userModel.findOne({ id }).exec();
    }

}