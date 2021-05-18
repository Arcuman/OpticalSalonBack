import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Sequelize } from 'sequelize-typescript';
import { NewsModule } from './news/news.module';
import { News } from './news/news.model';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.model';
import { SalonModule } from './salon/salon.module';
import { Salon } from './salon/salon.model';
import { ConsultationModule } from './salon/consultation/consultation.module';
import { Consultation } from './salon/consultation/consultation.model';
import { FavoriteNews } from './news/favoriteNews.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Role,
        UserRoles,
        News,
        Product,
        Salon,
        Consultation,
        FavoriteNews,
      ],
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    NewsModule,
    ProductModule,
    SalonModule,
    ConsultationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private sequelize: Sequelize) {
    this.sequelize.sync({ alter: true });
  }
}
