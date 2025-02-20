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

}