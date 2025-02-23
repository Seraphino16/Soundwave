import {
  Controller,
  Post,
  Body,
  BadRequestException,
  ConflictException,
  Get,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserErrors } from './errors/user.errors';
import { UserSuccess } from './success/user.success';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserSuccess> {
    try {
      const userId = await this.userService.createUser(createUserDto);

      return UserSuccess.userCreated(userId);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new BadRequestException(UserErrors.unknownError().message);
    }
  }
}
