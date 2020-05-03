import * as fs from 'fs';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export const imageExtensionValidation = (file: File) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    fs.unlinkSync(file.path);
    throw new BadRequestException('Invalid File extension');
  }
};

export const deleteFile = (path: string) => {
  try {
    fs.unlinkSync(path);
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException();
  }
};
