import {
  Column,
  DataType,
  HasMany,
  Length,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Consultation } from './consultation/consultation.model';

interface ProductCreationAttrs {
  name: string;
  city: string;
  address: string;
}

@Table({ tableName: 'salons' })
export class Salon extends Model<Salon, ProductCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Супер салон', description: 'Название' })
  @Length({ min: 0, max: 40 })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'Минск', description: 'Город' })
  @Length({ min: 0, max: 40 })
  @Column({ type: DataType.STRING, allowNull: false })
  city: string;

  @ApiProperty({
    example: 'Белорусская 21',
    description: 'Адрес',
  })
  @Length({ min: 0, max: 255 })
  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @HasMany(() => Consultation)
  consultations: Consultation[];
}
