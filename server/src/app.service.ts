import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly dbUrl: string;

  constructor(private configService: ConfigService) {
    const dbUrl = this.configService.get<string>('MONGODB_URI');

    if (!dbUrl) {
      throw new Error('MONGODB_URI is not defined in the .env file');
    }

    this.dbUrl = dbUrl;
  }

  getDatabaseUrl(): string {
    return this.dbUrl;
  }
  getHello(): string {
    return 'Hello World!';
  }
}