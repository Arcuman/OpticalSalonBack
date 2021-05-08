import { Module } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../users/users.model';
import { Consultation } from './consultation.model';
import { Salon } from '../salon.model';

@Module({
  controllers: [ConsultationController],
  providers: [ConsultationService],
  imports: [SequelizeModule.forFeature([User, Consultation, Salon])],
  exports: [ConsultationService],
})
export class ConsultationModule {}
