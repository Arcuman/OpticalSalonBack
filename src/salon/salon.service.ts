import { Injectable } from '@nestjs/common';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Salon } from './salon.model';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService, FileType } from '../files/files.service';

@Injectable()
export class SalonService {
  constructor(@InjectModel(Salon) private salonRepository: typeof Salon) {}

  async create(createSalonDto: CreateSalonDto): Promise<Salon> {
    return await this.salonRepository.create({
      ...createSalonDto,
    });
  }

  async findAll(offset = 0, limit = 10) {
    return await this.salonRepository.findAll({
      limit: Number(limit),
      offset: Number(offset),
    });
  }

  async findOne(id: number) {
    return await this.salonRepository.findByPk(id);
  }

  // async update(id: number, updateSalonDto: UpdateSalonDto) {
  //   return `This action updates a #${id} salon`;
  // }
  //
  // async remove(id: number) {
  //   return `This action removes a #${id} salon`;
  // }
}
