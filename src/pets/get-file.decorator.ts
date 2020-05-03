import { createParamDecorator, BadRequestException } from '@nestjs/common';

export const GetFile = createParamDecorator(
  (data, req): any => {
    if (!req.file) {
      throw new BadRequestException('Please add a file');
    }
    return req.file;
  },
);
