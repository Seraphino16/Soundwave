import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserListResponse } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('users')
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
    @Query('isVerified') isVerified?: string,
  ): Promise<UserListResponse> {
    try {
      const pageNumber = Number.parseInt(page, 10);
      const limitNumber = Number.parseInt(limit, 10);

      if (Number.isNaN(pageNumber) || pageNumber < 1) {
        throw new HttpException('Page invalide', HttpStatus.BAD_REQUEST);
      }

      if (Number.isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
        throw new HttpException(
          'Limit doit être entre 1 et 100',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Construire les filtres
      const filters = {
        search,
        role: role ?? undefined,
        isActive:
          isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        isVerified:
          isVerified === 'true'
            ? true
            : isVerified === 'false'
              ? false
              : undefined,
      };

      return await this.adminService.getAllUsers(
        pageNumber,
        limitNumber,
        sortBy,
        order,
        filters,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erreur lors de la récupération des utilisateurs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
