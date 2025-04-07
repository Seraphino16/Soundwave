import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { TokenErrors } from './errors/token.errors';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('generate-email-validation')
  generateEmailValidationToken(
    @Body() generateTokenDto: GenerateTokenDto,
  ): string {
    try {
      return this.tokenService.generateEmailValidationToken(generateTokenDto);
    } catch (error) {
      if (error instanceof TokenErrors) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        'Error generating email validation token',
      );
    }
  }

  @Post('generate-login')
  generateLoginToken(@Body() generateTokenDto: GenerateTokenDto): string {
    try {
      return this.tokenService.generateLoginToken(generateTokenDto);
    } catch (error) {
      if (error instanceof TokenErrors) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Error generating login token');
    }
  }

  @Get('validate')
  async validateToken(@Query('token') token: string): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const validationResult = await this.tokenService.validateToken(token);
      if (validationResult instanceof TokenErrors) {
        throw new BadRequestException(validationResult.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { message: 'Token valid', payload: validationResult };
    } catch (error) {
      if (error instanceof TokenErrors) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Error validating token');
    }
  }
}
