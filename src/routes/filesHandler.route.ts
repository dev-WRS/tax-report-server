import express from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

import logging from '../config/logging';
import FilesHandlerController from '../controllers/file-management/filesHandler.controller';
import { jwtAuthenticated } from '../middleware/auth.middleware';
import { checkRoleAuthorize } from '../middleware/admin.auth.middleware';

const router = express.Router();
const NAMESPACE = 'File Handler Route';

const uploadFolder = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
    logging.info(`Uploads Folder created successfully on ${uploadFolder}.`, { label: NAMESPACE });
}

const outputFolder = path.join(__dirname, '../../output');
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
    logging.info(`Output folder created successfully on ${outputFolder}.`, { label: NAMESPACE });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        logging.info(`Files uploaded successfully to ${uploadFolder}.`, { label: NAMESPACE });
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        logging.info(`Files ${file.originalname} uploaded successfully.`, { label: NAMESPACE });
        cb(null, file.originalname);
    }
});

// const option: multer.Options = {
//     storage: storage,
//     fileFilter: (req, file: Express.Multer.File, cb: FileFilterCallback) => {
//         const extName = path.extname(file.originalname);
//         if (extName === '.csv' || extName === '.xlsx') {
//             logging.info(`Files ${file.originalname} is allow to upload.`, { label: NAMESPACE });
//             cb(null, true);
//         } else {
//             logging.error(`Files ${file.originalname} is not allow to upload.`, { label: NAMESPACE });
//             cb(new Error('Invalid file type'));
//         }
//     }
// };
// const upload = multer(option);

// // router.post('/upload', jwtAuthenticated, checkRoleAuthorize, upload.array('files'), FilesHandlerController.filesUpload);

// router.post(
//     '/upload',
//     jwtAuthenticated,
//     checkRoleAuthorize,
//     (req: Request, res: Response, next: NextFunction) => {
//       upload.array('files')(req, res, (err: any) => {
//         if (err instanceof multer.MulterError) {
//           logging.error('Error uploading files.', { label: NAMESPACE, message: err.message });
//           return res.status(400).json({ message: 'Error uploading files', error: err });
//         } else if (err) {
//           logging.error('Error uploading files.', { label: NAMESPACE, message: err.message });
//           return res.status(500).json({ message: 'Error uploading files', error: err });
//         }
  
//         next();
//       });
//     },
//     FilesHandlerController.filesUpload
//   );

// export default router;

const option: multer.Options = {
    storage: storage,
    fileFilter: (req, file: Express.Multer.File, cb: FileFilterCallback) => {
      const extName = path.extname(file.originalname);
      if (extName === '.csv' || extName === '.xlsx') {
        logging.info(`File ${file.originalname} is allowed to upload.`, { label: NAMESPACE });
        cb(null, true);
      } else {
        logging.error(`File ${file.originalname} is not allowed to upload.`, { label: NAMESPACE });
        cb(new Error(`Invalid file type: ${file.originalname}`));
      }
    }
  };
  
  const upload = multer(option);
  
  router.post(
    '/upload',
    jwtAuthenticated,
    checkRoleAuthorize,
    (req: Request, res: Response, next: NextFunction) => {
      upload.array('files')(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
          logging.error('Error uploading files.', { label: NAMESPACE, message: err.message });
          return res.status(400).json({ message: 'Error uploading files', error: err });
        } else if (err) {
          logging.error('Error uploading files.', { label: NAMESPACE, message: err.message });
          return res.status(500).json({ message: 'Error uploading files', error: err.message });
        }
  
        const filesArray = Object.values(req.files) as Express.Multer.File[];
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
    },
    FilesHandlerController.filesUpload
  );
  
  export default router;