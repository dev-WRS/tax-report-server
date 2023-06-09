import express from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

import mboxFilesHandlerController from '@controllers/file-management/mboxFilesHandler.controller';
import { jwtAuthenticated } from '@middleware/auth.middleware';
import { checkRoleAuthorize } from '@middleware/admin.auth.middleware';
import { logger } from '@config/logging';

const router = express.Router();
const NAMESPACE = 'Mbox File Handler Route';
/** Ping to controller */
router.get('/ping', jwtAuthenticated, checkRoleAuthorize, mboxFilesHandlerController.mboxHealthCheck);

/** Upload mbox files */

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
        if (extName === '.mbox') {
            logger.info(`Files ${file.originalname} is allow to upload.`, { label: NAMESPACE });
            cb(null, true);
        } else {
            logger.error(`Files ${file.originalname} is not allow to upload.`, { label: NAMESPACE });
            cb(null, false);
        }
    }
};
const upload = multer(option);

router.post('/upload', jwtAuthenticated, checkRoleAuthorize, upload.array('files'), mboxFilesHandlerController.mboxFilesUpload);

/** Handle mbox files */
router.post('/handle', jwtAuthenticated, checkRoleAuthorize, mboxFilesHandlerController.mboxFileHandle);

/** Export route */
export default router;
