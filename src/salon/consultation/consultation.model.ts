import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Length,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/users.model';
import { Role } from '../../roles/roles.model';
import { UserRoles } from '../../roles/user-roles.model';
import { Salon } from '../salon.model';

interface ConsultationCreationAttrs {
  service: string;
  datetime: Date;
  userId: number;
  salonId: number;
}

@Table({ tableName: 'consultations' })
export class Consultation extends Model<
  Consultation,
  ConsultationCreationAttrs
> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: new Date(Date.now()),
    description: 'Дата и время',
    type: Date,
  })
  @Column({ type: DataType.DATE, allowNull: false })
  datetime: Date;

  @ApiProperty({
    example: 'Ремонт очков',
    description: 'Название сервиса',
  })
  @Length({ min: 0, max: 255 })
  @Column({ type: DataType.STRING, allowNull: false })
  service: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Salon)
  @Column({ type: DataType.INTEGER })
  salonId: number;

  @BelongsTo(() => Salon)
  salon: Salon;
}
