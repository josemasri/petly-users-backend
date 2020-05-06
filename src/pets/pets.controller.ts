import {
  Controller,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Logger,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Put,
  Patch,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';

import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { join } from 'path';
import {
  ApiTags,
  ApiConsumes,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiPropertyOptional,
  ApiQuery,
} from '@nestjs/swagger';
import { AddPetDto } from './dto/add-pet.dto';
import { imageExtensionValidation, File, resizeImage } from 'src/utils/utils';
import { v4 as uuid } from 'uuid';
import { PetsService } from './pets.service';
import { Pet } from './pet.entity';
import { AuthResUnauthorizedDto } from 'src/auth/dto/auth-res.dto';
import { InternalErrorDto } from 'src/auth/dto/internal-error.dto';
import { GetPetsDto } from './dto/get-pets.dto';
import { ImageUploadDto } from './dto/image-upload.dto';

@Controller('pets')
@ApiTags('Pets')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class PetsController {
  constructor(private petsService: PetsService) {}

  private logger = new Logger();

  @Post()
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: AuthResUnauthorizedDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalErrorDto,
  })
  async addPet(
    @Body(ValidationPipe) addPetDto: AddPetDto,
    @GetUser() user: User,
  ): Promise<Pet> {
    return await this.petsService.addPet(addPetDto, user);
  }

  /**
   * Upload pet image
   */

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, '..', 'public', 'images', 'pets'),
        filename: (req, file: File, cb) => {
          return cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image for your pet',
    type: ImageUploadDto,
  })
  @Post('image')
  async uploadImage(@UploadedFile() file: File) {
    imageExtensionValidation(file);
    return { url: await resizeImage(file) };
  }

  /**
   * Get available my pets
   */
  @Get('my-pets')
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @ApiOkResponse({
    description: 'A list of my pets in adoptiion',
    type: GetPetsDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: AuthResUnauthorizedDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalErrorDto,
  })
  async getMyPets(@GetUser() user: User): Promise<GetPetsDto> {
    const pets = await this.petsService.getMyPets(user.id);
    return { pets };
  }

  /**
   * Get available pets to adopt
   */
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    example: 10,
    allowEmptyValue: false,
    type: Number,
  })
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @ApiOkResponse({
    description: 'A list of available pets to adopt',
    type: GetPetsDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: AuthResUnauthorizedDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalErrorDto,
  })
  async getAvailablePets(
    @GetUser() user: User,
    @Query('page', ParseIntPipe) pageNumber: number,
  ): Promise<GetPetsDto> {
    const pets = await this.petsService.getAvailablePets(user.id, pageNumber);
    return { pets };
  }

  /**
   * Delete a pet
   */
  @Delete(':id')
  @ApiOkResponse({
    description: 'Deleted succesfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: AuthResUnauthorizedDto,
  })
  @ApiNotFoundResponse({
    description: 'Pet not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalErrorDto,
  })
  async deletePet(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    await this.petsService.deletePet(id, user);
  }

  /**
   * Update a pet
   */
  @Put(':id')
  @ApiOkResponse({
    description: 'Updated succesfully',
    type: AddPetDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: AuthResUnauthorizedDto,
  })
  @ApiNotFoundResponse({
    description: 'Pet not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalErrorDto,
  })
  async updatePet(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) addPetDto: AddPetDto,
    @GetUser() user: User,
  ) {
    await this.petsService.updatePet(id, user, addPetDto);
  }

  /**
   * Mark as adopted
   */
  @Patch(':id')
  @ApiOkResponse({
    description: 'Updated succesfully',
    type: AddPetDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: AuthResUnauthorizedDto,
  })
  @ApiNotFoundResponse({
    description: 'Pet not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalErrorDto,
  })
  async updatePetStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status', ParseBoolPipe) status: boolean,
    @GetUser() user: User,
  ) {
    await this.petsService.updatePetStatus(id, status, user);
  }
}
