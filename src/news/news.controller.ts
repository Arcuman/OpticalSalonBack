import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Query,
  UploadedFile,
  UseGuards,
  Put,
  Delete,
  NotFoundException,
  Patch,
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
import { UpdateNewsDto } from './dto/update-news.dto';
import { UpdateNewsImageDto } from './dto/update-news-image.dto';

@ApiTags('Новости')
@ApiSecurity('bearer')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

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
  @ApiQuery({ name: 'limit', type: 'Number', required: false })
  @ApiQuery({ name: 'offset', type: 'Number', required: false })
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.newsService.findAll(offset, limit);
  }

  @ApiResponse({ status: 200, type: News })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @ApiResponse({ status: 200, type: News })
  @ApiBody({
    description: 'Обновить главную информацию',
    type: UpdateNewsDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    const { numberOfAffectedRows, updatedNews } = await this.newsService.update(
      +id,
      updateNewsDto,
    );
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException('Такой новости не существует');
    }
    return updatedNews;
  }

  @ApiResponse({ status: 201, type: News })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add new news',
    type: UpdateNewsImageDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateImage(@Param('id') id: string, @UploadedFile() image) {
    const {
      numberOfAffectedRows,
      updatedNews,
    } = await this.newsService.updateImage(+id, image);
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
