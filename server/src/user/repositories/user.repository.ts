import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from '../entities/user.entity'

@Injectable()
export class UserRepository {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
    async create(email: string, password: string, googleId?: string): Promise<User> {
        const newUser = new this.userModel({ email, password, googleId });
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