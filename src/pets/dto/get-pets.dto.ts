import { ApiProperty } from '@nestjs/swagger';
import { Pet } from '../pet.entity';


export class GetPetsDto {
  /**
   * pets
   */
  @ApiProperty({
    type: [Pet],
    description: 'All available pets to adopt',
    example: [
      {
        id: 3,
        animal: 'Dog',
        name: 'Poncho',
        age: 3,
        imageUrl: 'a38c7bd5-1505-439e-b950-1758c7d0f33d.jpg',
        desctiption:
          'Dolor in irure officia velit pariatur incididunt magna non. Eu irure culpa eu eiusmod adipisicing ex nulla occaecat nisi labore excepteur aliqua reprehenderit. Culpa ea id exercitation in sint officia pariatur et laborum nostrud culpa pariatur...',
        userId: 1,
        createdAt: '2020-05-02T14:05:00.541Z',
      },
      {
        id: 4,
        animal: 'Dog',
        name: 'Poncho',
        age: 3,
        imageUrl: 'd84aec35-72c1-47dd-b508-a429cf07ce8b.jpg',
        desctiption:
          'Dolor in irure officia velit pariatur incididunt magna non. Eu irure culpa eu eiusmod adipisicing ex nulla occaecat nisi labore excepteur aliqua reprehenderit. Culpa ea id exercitation in sint officia pariatur et laborum nostrud culpa pariatur...',
        userId: 1,
        createdAt: '2020-05-02T14:10:41.832Z',
      },
      {
        id: 5,
        animal: 'Dog',
        name: 'Poncho',
        age: 3,
        imageUrl: '79547dc1-6c14-4ecc-8760-4457898f8e81.jpg',
        desctiption:
          'Dolor in irure officia velit pariatur incididunt magna non. Eu irure culpa eu eiusmod adipisicing ex nulla occaecat nisi labore excepteur aliqua reprehenderit. Culpa ea id exercitation in sint officia pariatur et laborum nostrud culpa pariatur...',
        userId: 1,
        createdAt: '2020-05-02T14:14:22.567Z',
      },
    ],
  })
  pets: Pet[];
}
