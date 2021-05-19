import {
  Body,
  Controller,
  Req,
  Get,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './users.model';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';
import { RolesGuard } from '../roles/guards/roles.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConsultationService } from '../salon/consultation/consultation.service';
import { AddFavoriteNewsDto } from './dto/add-favorite-news-dto';

@ApiTags('Пользователи')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private consultationService: ConsultationService,
  ) {}

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Получить информацию о профиле' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(RolesGuard)
  @Get('/profile')
  async getUserInfo(@Req() req) {
    const user = await this.usersService.getUserById(req.user.userId);
    return user.toJSON();
  }

  @ApiOperation({ summary: 'Выдать роль' })
  @ApiResponse({ status: 200 })
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({ summary: 'Добавить в избранное новость' })
  @ApiResponse({ status: 200 })
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Post('/favorite/news')
  addFavoriteNews(@Body() dto: AddFavoriteNewsDto, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.usersService.addFavoriteNews(dto, user.userId);
  }

  @ApiOperation({ summary: 'Удалить из избранного новость' })
  @ApiResponse({ status: 200 })
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Delete('/favorite/news')
  deleteFavoriteNews(@Body() dto: AddFavoriteNewsDto, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.usersService.deleteFavoriteNews(dto, user.userId);
  }

  @ApiOperation({ summary: 'Удалить из избранного новость' })
  @ApiResponse({ status: 200 })
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Get('/favorite/news')
  async getFavoritesNews(@Req() req: Request) {
    const user = req.user as { userId: number };
    const favoriteNews = await this.usersService.getFavoriteNews(user.userId);
    return favoriteNews.map((item) => ({ ...item.toJSON(), isFavorite: true }));
  }

  @ApiOperation({ summary: 'Получить все консультации пользователя' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Get('consultations')
  getConsultation(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.consultationService.findConsultationsByUserId(user);
  }
}
