import {
  MinLength,
  IsString,
  MaxLength,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPetDto {
  /**
   * animal
   */
  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 50,
    example: 'Dog',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  animal: string;
  /**
   * name
   */
  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 20,
    example: 'Poncho',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;
  /**
   * Age
   */
  @ApiProperty({
    type: Number,
    minLength: 1,
    maxLength: 2,
    example: 3,
  })
  @IsNumberString()
  @MaxLength(2)
  age: number;
  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 20,
    description: 'The pet description',
    example:
      'Dolor in irure officia velit pariatur incididunt magna non. Eu irure culpa eu eiusmod adipisicing ex nulla occaecat nisi labore excepteur aliqua reprehenderit. Culpa ea id exercitation in sint officia pariatur et laborum nostrud culpa pariatur...',
  })
  description: string;
}
