import { Request, Response, NextFunction } from "express";

import { S3File } from '@interfaces/s3bucket.interface';

export const fileHandler = (req: Request, _: Response, next: NextFunction) => {
  const { files } = req;

  const mappedFiles: S3File[] = ((files as Express.Multer.File[]) || []).map(
    (file) => ({
      name: file.originalname,
      type: file.mimetype,
      content: file.buffer,
      size: file.size,
      extension: `${file.originalname.split(".").pop()}`,
    })
  );

  Object.assign(req.body, { files: mappedFiles });
  return next();
};