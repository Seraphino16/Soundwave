import { Controller, Post, Body, BadRequestException, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserErrors } from './errors/user.errors';
import { UserSuccess } from './success/user.success';
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('create')
    async create(@Body() createUserDto: CreateUserDto): Promise<UserSuccess> {
        try {
            const userId = await this.userService.createUser(createUserDto);

            return UserSuccess.userCreated(userId);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

           throw new BadRequestException(UserErrors.unknownError().message);
        }
    }
}
