import { ApiProperty } from '@nestjs/swagger';

export class UpdateNewsImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
