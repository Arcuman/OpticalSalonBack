import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteProductsDto {
  @ApiProperty({ example: 1, description: 'News ID' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly productId: number;
}
