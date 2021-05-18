import { IsNumber, IsString } from 'class-validator';
import { Role } from '../../roles/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteNewsDto {
  @ApiProperty({ example: 1, description: 'News ID' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly newsId: number;
}
