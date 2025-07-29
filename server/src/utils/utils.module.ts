import { Module } from '@nestjs/common';
import { PasswordUtil } from './password';

@Module({
  providers: [PasswordUtil],
  exports: [PasswordUtil],
})
export class UtilsModule {}
