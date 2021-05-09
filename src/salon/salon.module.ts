import { Module } from '@nestjs/common';
import { SalonService } from './salon.service';
import { SalonController } from './salon.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Salon } from './salon.model';
import { Consultation } from './consultation/consultation.model';
import { ConsultationModule } from './consultation/consultation.module';

@Module({
  controllers: [SalonController],
  providers: [SalonService],
  imports: [
    SequelizeModule.forFeature([Salon, Consultation]),
    ConsultationModule,
  ],
})
export class SalonModule {}
