import express from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

import FilesHandlerController from '@controllers/file-management/filesHandler.controller';
import { jwtAuthenticated } from '@middleware/auth.middleware';
import { checkRoleAuthorize } from '@middleware/admin.auth.middleware';
import fileUploadMiddleware from '@middleware/file.upload.middleware';
import { logger } from '@config/logging';

const fileHandlerRouter = express.Router();
const NAMESPACE = 'File Handler Route';

const uploadFolder = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
    logger.info(`Uploads Folder created successfully on ${uploadFolder}.`, { label: NAMESPACE });
}

const outputFolder = path.join(__dirname, '../../output');
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
    logger.info(`Output folder created successfully on ${outputFolder}.`, { label: NAMESPACE });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        logger.info(`Files uploaded successfully to ${uploadFolder}.`, { label: NAMESPACE });
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        logger.info(`Files ${file.originalname} uploaded successfully.`, { label: NAMESPACE });
        cb(null, file.originalname);
    }
});

const option: multer.Options = {
    storage: storage,
    fileFilter: (req, file: Express.Multer.File, cb: FileFilterCallback) => {
      const extName = path.extname(file.originalname);
      if (extName === '.csv' || extName === '.xlsx') {
        logger.info(`File ${file.originalname} is allowed to upload.`, { label: NAMESPACE });
        cb(null, true);
      } else {
        logger.error(`File ${file.originalname} is not allowed to upload.`, { label: NAMESPACE });
        cb(new Error(`Invalid file type: ${file.originalname}`));
      }
    }
};
  
const upload = multer(option);
  
fileHandlerRouter.post(
    '/upload',
    jwtAuthenticated,
    checkRoleAuthorize,
    fileUploadMiddleware,
    FilesHandlerController.filesUpload
);

fileHandlerRouter.delete('/delete/:id', jwtAuthenticated, checkRoleAuthorize, FilesHandlerController.deleteFile);
fileHandlerRouter.get('/:id', jwtAuthenticated, checkRoleAuthorize, FilesHandlerController.downloadFile);
fileHandlerRouter.post('/replace/:id', jwtAuthenticated, checkRoleAuthorize, fileUploadMiddleware, FilesHandlerController.replaceFile);
  
export default fileHandlerRouter;