import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { News } from './news.model';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService, FileType } from '../files/files.service';
import { Op } from 'sequelize';

@Injectable()
export class NewsService {
  constructor(
    private fileService: FilesService,
    @InjectModel(News) private newsRepository: typeof News,
  ) {}

  async create(createNewsDto: CreateNewsDto, image): Promise<News> {
    const imagePath = this.fileService.createFile(FileType.IMAGE, image);
    return await this.newsRepository.create({
      ...createNewsDto,
      image: imagePath,
      date: new Date(Date.now()),
    });
  }

  async findAll(name = '', offset = 0, limit = 50) {
    return await this.newsRepository.findAll({
      limit: Number(limit),
      offset: Number(offset),
      where: { title: { [Op.like]: `%${name}%` } },
    });
  }

  async findOne(id: number) {
    return await this.newsRepository.findByPk(id);
  }

  async delete(id) {
    return await this.newsRepository.destroy({ where: { id } });
  }

  async update(id: number, updateNewsDto: CreateNewsDto, image: any) {
    delete updateNewsDto.image;
    if (image) {
      updateNewsDto.image = this.fileService.createFile(FileType.IMAGE, image);
    }
    const [
      numberOfAffectedRows,
      [updatedNews],
    ] = await this.newsRepository.update(
      { ...updateNewsDto },
      { where: { id }, returning: true },
    );
    return { numberOfAffectedRows, updatedNews };
  }
}
