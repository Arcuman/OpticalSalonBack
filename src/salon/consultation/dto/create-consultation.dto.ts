import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateConsultationDto {
  @ApiProperty({ example: 'Супер салон', description: 'Название' })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @MaxLength(40, { message: 'Не больше 40' })
  service: string;

  @ApiProperty({ example: new Date(Date.now()), description: 'Дата' })
  @IsDateString({}, { message: 'Должно быть датой' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @MaxLength(40, { message: 'Не больше 40' })
  datetime: Date;

  @ApiProperty({
    example: 1,
    description: 'Индентификатор пользователя',
  })
  @IsNumber({}, { message: 'Должно быть числом' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'Индентификатор салона',
  })
  @IsNumber({}, { message: 'Должно быть числом' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  salonId: number;
}
