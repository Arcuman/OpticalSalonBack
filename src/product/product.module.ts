import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesService } from '../files/files.service';
import { Product } from './product.model';
import { User } from '../users/users.model';
import { FavoriteProducts } from './favoriteProducts.model';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService, FilesService],
  imports: [
    SequelizeModule.forFeature([Product, FavoriteProducts, User]),
    forwardRef(() => UsersModule),
  ],
  exports: [ProductService],
})
export class ProductModule {}
