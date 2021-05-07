import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { News } from './news.model';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService, FilesService],
  imports: [SequelizeModule.forFeature([News])],
})
export class NewsModule {}
