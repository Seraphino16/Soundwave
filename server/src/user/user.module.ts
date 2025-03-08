import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { MailerModule } from '../mailer/mailer.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserSchema } from './entities/user.entity';
import { TokenModule } from '../token/token.module';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MailerModule,
    HttpModule,
    TokenModule,
  ],
  providers: [UserService, UserRepository, JwtAuthGuard],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
