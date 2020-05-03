import { ApiProperty } from '@nestjs/swagger';

export class AuthResSuccessDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;
  @ApiProperty({
    type: Number,
    example: 3600,
  })
  expiresIn: number;
  @ApiProperty({
    example: 'seconds',
  })
  unit: string;
}

export class AuthResConflictDto {
  @ApiProperty({
    type: Number,
    example: 409,
  })
  statusCode: number;
  @ApiProperty({
    type: String,
    example: 'Email already exists',
  })
  message: string;
  @ApiProperty({
    type: String,
    example: 'Conflict',
  })
  error: string;
}


export class AuthResUnauthorizedDto {
  @ApiProperty({
    type: Number,
    example: 401,
  })
  statusCode: number;
  @ApiProperty({
    type: String,
    example: 'Invalid credentials',
  })
  message: string;
  @ApiProperty({
    type: String,
    example: 'Unauthorized',
  })
  error: string;
}