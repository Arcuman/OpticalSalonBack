import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesService } from '../files/files.service';
import { Product } from './product.model';

@Module({
  controllers: [ProductController],
  providers: [ProductService, FilesService],
  imports: [SequelizeModule.forFeature([Product])],
  exports: [ProductService],
})
export class ProductModule {}
