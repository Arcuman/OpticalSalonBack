import { forwardRef, Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { News } from './news.model';
import { FilesService } from '../files/files.service';
import { FavoriteNews } from './favoriteNews.model';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService, FilesService],
  imports: [
    SequelizeModule.forFeature([News, FavoriteNews]),
    forwardRef(() => UsersModule),
  ],
  exports: [NewsService],
})
export class NewsModule {}
