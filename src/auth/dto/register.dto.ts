import { MinLength, IsString, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    type: String,
    minLength: 2,
    maxLength: 20,
    example: 'John',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  firstName: string;
  @ApiProperty({
    type: String,
    minLength: 2,
    maxLength: 20,
    example: 'Doe',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  lastName: string;
  @ApiProperty({
    type: String,
    minLength: 2,
    maxLength: 20,
    example: 'CDMX',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  state: string;
  @ApiProperty({
    type: String,
    minLength: 4,
    maxLength: 20,
    example: 'Mexico',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  country: string;
  @ApiProperty({
    type: String,
    minLength: 4,
    maxLength: 20,
    example: 'Huixquilucan',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  county: string;
  @ApiProperty({
    type: String,
    example: 'test@mail.com',
  })
  @Matches(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    {
      message: 'Email not valid',
    },
  )
  email: string;
  @ApiProperty({
    type: String,
    example: '?=)myPaSSword12',
    minLength: 8,
    maxLength: 25,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(25)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}
