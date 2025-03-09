import {
  Controller,
  Post,
  Body,
  BadRequestException,
  ConflictException,
  Get,
  Query,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserErrors } from './errors/user.errors';
import { UserSuccess } from './success/user.success';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserSuccess> {
    try {
      const userId = await this.userService.createUser(createUserDto);

      const generateTokenDto = {
        email: createUserDto.email,
        username: createUserDto.username,
        id: userId,
      };


      const tokenResponse = await firstValueFrom(
        this.httpService.post(
          'http://localhost:5001/token/generate-email-validation',
          generateTokenDto,
        ),
      );

      const token = tokenResponse.data;
      await this.userService.saveValidationToken(userId, token);

      await firstValueFrom(
        this.httpService.post(
          'http://localhost:5001/mailer/send-validation-email',
          {
            email: createUserDto.email,
            token: token,
          },
        ),
      );

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

  @Get('validate')
  async validateAccount(@Query('token') token: string): Promise<UserSuccess> {
    try {
      await this.userService.validateAndActivateAccount(token);
      return UserSuccess.accountValidated();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erreur interne lors de la validation du compte',
      );
    }
  }

  @Patch('request-artist')
  async requestArtist(
    @Body('automatic') automatic: string,
    @Body('id') id: number,
  ) {
    try {
      if (!automatic) {
        const updatedUser = await this.userService.assignArtistRole(id);
        return UserSuccess.userRoleUpdated(updatedUser);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(UserErrors.unknownError().message);
    }
  }
}
