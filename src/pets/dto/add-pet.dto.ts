import {
  MinLength,
  IsString,
  MaxLength,
  IsNumberString,
  Matches,
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
  @ApiProperty({
    type: String,
    example:
      'https://res.cloudinary.com/dzk5e5wtw/image/upload/v1588606148/xxijjwrleehtfrnrmj3r.jpg',
  })
  @IsString()
  @Matches(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  )
  imageUrl: string;
}
