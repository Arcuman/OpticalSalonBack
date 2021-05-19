import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService, FileType } from '../files/files.service';
import { Op } from 'sequelize';

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

  async findAll(name = '', offset = 0, limit = 10, price = 99999999999) {
    return await this.productRepository.findAll({
      limit: Number(limit),
      offset: Number(offset),
      where: {
        [Op.and]: {
          name: { [Op.like]: `%${name}%` },
          cost: { [Op.lt]: price },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.productRepository.findByPk(id);
  }

  async update(id: number, updateProductDto: CreateProductDto, image: any) {
    delete updateProductDto.photo;
    if (image) {
      updateProductDto.photo = this.fileService.createFile(
        FileType.IMAGE,
        image,
      );
    }
    const [
      numberOfAffectedRows,
      [updatedProducts],
    ] = await this.productRepository.update(
      { ...updateProductDto },
      { where: { id }, returning: true },
    );
    return { numberOfAffectedRows, updatedProducts };
  }

  async delete(id) {
    return await this.productRepository.destroy({ where: { id } });
  }
}
