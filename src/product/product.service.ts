import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService, FileType } from '../files/files.service';

@Injectable()
export class ProductService {
  constructor(
    private fileService: FilesService,
    @InjectModel(Product) private productRepository: typeof Product,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    image: string,
  ): Promise<Product> {
    const imagePath = this.fileService.createFile(FileType.IMAGE, image);
    return await this.productRepository.create({
      ...createProductDto,
      photo: imagePath,
    });
  }

  async findAll(offset = 0, limit = 10) {
    return await this.productRepository.findAll({
      limit: Number(limit),
      offset: Number(offset),
    });
  }

  async findOne(id: number) {
    return await this.productRepository.findByPk(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
