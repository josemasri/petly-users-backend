import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

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

export const resizeImage = async (file: File): Promise<string> => {
  const resizedPath = path.join(
    __dirname,
    '..',
    'public',
    'images',
    'pets',
    `e-${file.filename}`,
  );
  try {
    await sharp(file.path)
      .resize(380, 550)
      .toFile(resizedPath);
    deleteFile(file.path);
    const externalUrl = await uploadFileCloudinary(resizedPath);
    deleteFile(resizedPath);
    return externalUrl;
  } catch (error) {
    console.log(error);
    deleteFile(file.path);
    throw new InternalServerErrorException();
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

export const uploadFileCloudinary = async (path: string): Promise<string> => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_APIKEY,
    api_secret: process.env.CLOUD_SECRET,
  });
  try {
    const res = await cloudinary.uploader.upload(path);
    return res.secure_url;
  } catch (error) {
    throw new InternalServerErrorException();
  }
};

export const deleteFileCloudinary = async (url: string): Promise<boolean> => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_APIKEY,
    api_secret: process.env.CLOUD_SECRET,
  });
  const fileId = url.split('/')[url.split('/').length - 1].split('.')[0];
  try {
    const res = await cloudinary.uploader.destroy(fileId);
    return true;
  } catch (error) {
    throw new InternalServerErrorException();
  }
};
