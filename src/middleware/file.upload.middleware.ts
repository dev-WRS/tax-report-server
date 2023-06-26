import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

import logging from '../config/logging';

const fileUploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer().array('files');

  upload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      logging.error('Error uploading files.', { message: err.message });
      return res.status(400).json({ message: 'Error uploading files', error: err });
    } else if (err) {
      logging.error('Error uploading files.', { message: err.message });
      return res.status(500).json({ message: 'Error uploading files', error: err.message });
    }

    const filesArray = req.files as Express.Multer.File[];
    const invalidFiles = filesArray.filter((file: Express.Multer.File) => {
      const extName = path.extname(file.originalname);
      return extName !== '.csv' && extName !== '.xlsx';
    });

    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map((file: Express.Multer.File) => file.originalname);
      return res.status(400).json({ message: 'Invalid file types', invalidFiles: invalidFileNames });
    }

    next();
  });
};

export default fileUploadMiddleware;