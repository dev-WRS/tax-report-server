import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

import logging from '../../config/logging';

const NAMESPACE = 'File Handler Controller';

/**Response to upload File */
const filesUpload = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const files = req.files as Express.Multer.File[];
        logging.info('Files uploaded successfully.', { label: NAMESPACE });
        res.status(200).json({ message: 'Files uploaded successfully', files: files });
    } catch (err: any) {
        logging.error('Error uploading files.', { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error uploading files', error: err });
    }
};

export default { filesUpload };