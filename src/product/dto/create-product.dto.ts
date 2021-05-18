import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Очки',
    description: 'Название',
    maxLength: 40,
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @MaxLength(40, { message: 'Не больше 40' })
  name: string;

  @ApiProperty({
    example: 'Nivea',
    description: 'Brand',
    maxLength: 40,
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @MaxLength(40, { message: 'Не больше 40' })
  brand: string;

  @ApiProperty({
    example: 'БАВ2345',
    description: 'Модель',
    maxLength: 40,
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @MaxLength(40, { message: 'Не больше 40' })
  model: string;

  @ApiProperty({
    example: 'Lorem daasdas фывыфвыфв',
    description: 'Описание',
    maxLength: 255,
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @MaxLength(255, { message: 'Не больше 255' })
  description: string;

  @ApiProperty({
    example: 1,
    description: 'Цена',
    minimum: 0,
  })
  @Transform((value) => {
    if (+value.value) {
      return +value.value;
    }
    return -1;
  })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @Min(0)
  cost: number;

  @ApiProperty({
    example: 'Беларусь',
    description: 'Страна',
    maxLength: 40,
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @MaxLength(40, { message: 'Не больше 40' })
  country: string;

  @ApiProperty({
    example: 'Металл',
    description: 'Материал',
    maxLength: 40,
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @MaxLength(40, { message: 'Не больше 40' })
  material: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  photo: any;
}
