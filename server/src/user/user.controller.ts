import {
  Controller,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Post,
  Query,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserInfosDto } from './dto/update-user-infos.dto';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Put(':userId/infos')
  @UseInterceptors(
    FileInterceptor('profilePicture'),
    FileInterceptor('bannerPicture'),
  )
  async updateUserInfos(
    @Param('userId') userId: number,
    @Body() updateUserInfosDto: UpdateUserInfosDto,
    @UploadedFile('profilePicture') profilePicture?: Express.Multer.File,
    @UploadedFile('bannerPicture') bannerPicture?: Express.Multer.File,
  ) {
    try {
      const updatedUserInfos = await this.userService.updateInfos(
        userId,
        updateUserInfosDto,
        profilePicture,
        bannerPicture,
      );
      return updatedUserInfos;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour des informations.',
      );
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
}
