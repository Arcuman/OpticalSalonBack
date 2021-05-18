import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({
    example: 'Открытие магазина',
    description: 'Заголовок',
    maxLength: 40,
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @MaxLength(40, { message: 'Не больше 40' })
  title: string;

  @ApiProperty({
    example: 'Описание открытия нового магазина',
    description: 'Описание',
    maxLength: 255,
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @MaxLength(255, { message: 'Не больше 255' })
  description: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image: any;
}
