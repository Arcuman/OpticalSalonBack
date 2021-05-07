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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host: process.env.MSSQL_HOST,
      username: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD,
      database: process.env.MSSQL_DATABASE,
      models: [User, Role, UserRoles, News],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    NewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private sequelize: Sequelize) {
    this.sequelize.sync({ alter: true });
  }
}
