import { Injectable } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { Consultation } from './consultation.model';
import { InjectModel } from '@nestjs/sequelize';
import { Salon } from '../salon.model';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectModel(Consultation)
    private consultationRepository: typeof Consultation,
  ) {}

  async create(
    createConsultationDto: CreateConsultationDto,
  ): Promise<Consultation> {
    return await this.consultationRepository.create({
      ...createConsultationDto,
    });
  }

  async findAll(offset = 0, limit = 10) {
    return await this.consultationRepository.findAll({
      limit: Number(limit),
      offset: Number(offset),
    });
  }

  async findConsultationsByUserId({ userId }: { userId: number }) {
    return await this.consultationRepository.findAll({
      where: { userId },
      include: [Salon],
    });
  }

  async findOne(id: number) {
    return await this.consultationRepository.findByPk(id);
  }

  // async update(id: number, updateConsultationDto: UpdateConsultationDto) {
  //   return `This action updates a #${id} consultation`;
  // }
  //
  // async remove(id: number) {
  //   return `This action removes a #${id} consultation`;
  // }
}
