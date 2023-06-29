import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { Readable } from 'stream';

import { checkBucket, deleteFileFromS3, getFileFromS3, replaceFilesInS3, uploadFilesToS3 } from '../../services/filesHandler.service';
import logging from '../../config/logging';

const NAMESPACE = 'File Handler Controller';

/**Response to upload File */
const filesUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const check = await checkBucket();
        if (check.response !== 200) {
            logging.error('Error uploading files.', { label: NAMESPACE, message: 'Error bucket do not exist' });
            res.status(500).json({ message: 'Error uploading files', error: 'Error bucket do not exist' });
        }

        const files = req.files as Express.Multer.File[];

        const sessionToken = req.headers['authorization'];

        const filesCreated = await uploadFilesToS3(check.s3, files, sessionToken);

        logging.info('Files uploaded successfully.', { label: NAMESPACE });
        res.status(200).json({ message: 'Files uploaded successfully', data: filesCreated });
    } catch (err: any) {
        logging.error('Error uploading files.', { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error uploading files', error: err });
    }
};

const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fileId = req.params.id;
        const check = await checkBucket();
        if (check.response !== 200) {
            logging.error('Error deleting file.', { label: NAMESPACE, message: 'Error bucket do not exist' });
            res.status(500).json({ message: 'Error deleting file', error: 'Error bucket do not exist' });
        }

        const deleted = await deleteFileFromS3(check.s3, fileId);

        if (!deleted) {
            logging.error('Error deleting file.', { label: NAMESPACE, message: 'Error deleting file.' });
            res.status(500).json({ message: 'Error deleting file', error: 'Error deleting file.' });
        } else {
            logging.info('File deleted successfully.', { label: NAMESPACE });
            res.status(200).json({ message: 'File deleted successfully', deleted });
        }
    } catch (err: any) {
        logging.error('Error deleting file.', { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error deleting file', error: err });
    }
};

const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fileId = req.params.id;
        const check = await checkBucket();
        if (check.response !== 200) {
            logging.error('Error deleting file.', { label: NAMESPACE, message: 'Error bucket do not exist' });
            res.status(500).json({ message: 'Error deleting file', error: 'Error bucket do not exist' });
        }

        const fileFromS3 = await getFileFromS3(check.s3, fileId);

        if (!fileFromS3) {
            logging.error('Error getting file.', { label: NAMESPACE, message: 'Error getting file.' });
            res.status(500).json({ message: 'Error getting file', error: 'Error getting file.' });
        } else {
            logging.info('File downloaded successfully.', { label: NAMESPACE });

            let contentType = '';
            const fileExtension = path.extname(fileFromS3.fileName);
            if (fileExtension === '.csv') {
              contentType = 'text/csv';
            } else if (fileExtension === '.xlsx') {
              contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            }
          
            res.writeHead(200, { 'Content-Type': contentType });
            const readableStream = Readable.from(fileFromS3.readable);
            readableStream.pipe(res);
        }
    } catch (err) {
        logging.error('Error getting file.', { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error getting file', error: err.message });
    }
};

const replaceFile = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const projectId = req.params.id;        
        const fileId = req.query.fileId;
        const assetId = req.query.assetId.toString();
        const sessionToken = req.headers['authorization'];

        if (projectId === undefined || projectId === null || projectId === '') {
            return res.status(400).json({ message: 'Project to replace file is required' });
        }

        if (fileId === undefined || fileId === null || fileId === '') {
            return res.status(400).json({ message: 'File to replace is required' });
        }

        if (assetId === undefined || assetId === null || assetId === '') {
            return res.status(400).json({ message: 'Asset to replace is required' });
        }
    
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
    
        const check = await checkBucket();
        if (check.response !== 200) {
            logging.error('Error uploading files.', { label: NAMESPACE, message: 'Error bucket do not exist' });
            res.status(500).json({ message: 'Error uploading files', error: 'Error bucket do not exist' });
        }
    
        const files = req.files as Express.Multer.File[];
    
        const filesCreated = await replaceFilesInS3(check.s3, files[0], fileId.toString(), sessionToken, projectId, assetId);
    
        logging.info('Files replaced successfully.', { label: NAMESPACE });
        res.status(200).json({ message: 'Files replaced successfully', files: filesCreated });
    } catch (err) {
        logging.error('Error uploading files.', { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error replacing files', error: err });
    }


};

export default { filesUpload, deleteFile, downloadFile, replaceFile };