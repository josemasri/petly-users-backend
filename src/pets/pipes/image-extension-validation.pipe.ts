import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageExtensionValidationPipe implements PipeTransform {
  transform(file: any) {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException('Invalid File extention');
    }
    return file;
  }
}
