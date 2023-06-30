import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

import mboxHandlerService from '@services/mbox-handler.service';
import { logger } from '@config/logging';

const NAMESPACE = 'Mbox File Handler Controller';

/**Response to ping */
const mboxHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    logger.info('Mbox health check route called.', { label: NAMESPACE });
    return res.status(200).json({
        message: 'mbox pong'
    });
};

/**Response to upload mboxFile */
const mboxFilesUpload = (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];
        logger.info('Files uploaded successfully.', { label: NAMESPACE });
        res.status(200).json({ message: 'Files uploaded successfully', files: files });
    } catch (err: any) {
        logger.error('Error uploading files.', { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error uploading files', error: err });
    }
};

/**Response to handle mboxFile */
async function mboxFileHandle(req: Request, res: Response, next: NextFunction) {
    try {
        const filepath = path.join(__dirname, '../../../uploads', req.body.filename);
        logger.info(`File ${req.body.filename} handled successfully.`, { label: NAMESPACE });
        const readStream = fs.createReadStream(filepath, 'utf-8');
        await mboxHandlerService.handleMboxFiles(readStream, req.body.filename);
        res.status(200).json({ message: 'Files handled successfully', filename: req.body.filename });
    } catch (err: any) {
        logger.error(`Error handling file ${req.body.filename}.`, { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error handling files', error: err });
    }
}

export default { mboxHealthCheck, mboxFilesUpload, mboxFileHandle };
