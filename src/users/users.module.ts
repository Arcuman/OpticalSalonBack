import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { Consultation } from '../salon/consultation/consultation.model';
import { ConsultationService } from '../salon/consultation/consultation.service';
import { ConsultationModule } from '../salon/consultation/consultation.module';
import { News } from '../news/news.model';
import { FavoriteNews } from '../news/favoriteNews.model';
import { NewsModule } from '../news/news.module';
import { FavoriteProducts } from '../product/favoriteProducts.model';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      UserRoles,
      Consultation,
      News,
      FavoriteNews,
      FavoriteProducts,
    ]),
    RolesModule,
    NewsModule,
    ProductModule,
    ConsultationModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
