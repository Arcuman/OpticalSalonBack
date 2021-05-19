import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';
import { News } from './news.model';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@ApiTags('Новости')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly userService: UsersService,
  ) {}

  @ApiResponse({ status: 201, type: News })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add new news',
    type: CreateNewsDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@UploadedFile() image, @Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto, image);
  }

  @Get()
  @ApiResponse({ status: 200, type: [News] })
  @ApiQuery({ name: 'name', type: 'String', required: false })
  @ApiQuery({ name: 'limit', type: 'Number', required: false })
  @ApiQuery({ name: 'offset', type: 'Number', required: false })
  async findAll(
    @Req() req: Request,
    @Query('name') name?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const user = req.user as { userId: number };
    const news = await this.newsService.findAll(name, offset, limit);
    const favorite = await this.userService.getFavoriteNews(user.userId);
    return news
      .map((oneNews) => {
        let isFavorite = false;
        if (favorite.some((favorite) => favorite.id === oneNews.id)) {
          isFavorite = true;
        }
        return { ...oneNews.toJSON(), isFavorite };
      })
      .sort((a: any, b: any) => b.id - a.id);
  }

  @ApiResponse({ status: 200, type: News })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @ApiResponse({ status: 201, type: News })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add new news',
    type: CreateNewsDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() image,
    @Body() createNewsDto: CreateNewsDto,
  ) {
    const { numberOfAffectedRows, updatedNews } = await this.newsService.update(
      +id,
      createNewsDto,
      image,
    );
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException('Такой новости не существует');
    }
    return updatedNews;
  }

  @ApiResponse({ status: 200 })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.newsService.delete(id);
    if (deleted === 0) {
      throw new NotFoundException('Такой новости не существует');
    }
    return 'Successfully deleted';
  }
}
