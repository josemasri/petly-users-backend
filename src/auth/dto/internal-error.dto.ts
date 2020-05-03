import { ApiProperty } from '@nestjs/swagger';

export class InternalErrorDto {
  @ApiProperty({
    type: Number,
    example: 500,
  })
  statusCode: number;
  @ApiProperty({
    type: String,
    example: 'Internal Server Error',
  })
  message: string;
}
