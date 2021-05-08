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
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';

@ApiTags('Новости')
@ApiSecurity('bearer')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add new news',
    type: CreateNewsDto,
  })
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@UploadedFile() image, @Body() createNewsDto: CreateNewsDto) {
    console.log(image);
    console.log(createNewsDto);
    return this.newsService.create(createNewsDto, image);
  }

  @Get()
  @ApiQuery({ name: 'limit', type: 'Number', required: false })
  @ApiQuery({ name: 'offset', type: 'Number', required: false })
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.newsService.findAll(offset, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }*/
}
