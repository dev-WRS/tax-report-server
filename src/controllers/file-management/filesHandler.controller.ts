import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { Readable } from 'stream';

import { checkBucket, deleteFileFromS3, getFileFromS3, replaceFilesInS3, 
         uploadFilesToS3 } from '@services/filesHandler.service';
import { getErrorMessage } from '@utils/error.utils';
import { logger } from '@config/logging';

const NAMESPACE = 'File Handler Controller';

/**Response to upload File */
const filesUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('File Upload process started.', { label: NAMESPACE });
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const check = await checkBucket();
        if (check.response !== 200) {
            logger.error('Error uploading file bucket do not exist', { label: NAMESPACE });
            res.status(500).json({ message: 'Error uploading files, bucket do not exist' });
        }

        const files = req.files as Express.Multer.File[];

        const sessionToken = req.headers['authorization'];

        const filesCreated = await uploadFilesToS3(check.s3, files, sessionToken);

        logger.info('Files uploaded successfully.', { label: NAMESPACE });
        res.status(200).json({ message: 'Files uploaded successfully', data: filesCreated });
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error uploading files - ${errorMessage}`, { label: NAMESPACE });
        res.status(500).json({ message: `Error uploading files - ${errorMessage}`});
    }
};

const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Delete file process started.',{ label: NAMESPACE });

        const fileId = req.params.id;
        const check = await checkBucket();
        if (check.response !== 200) {
            logger.error('Error deleting file. bucket do not exist', { label: NAMESPACE });
            res.status(500).json({ message: 'Error deleting file, bucket do not exist' });
        }

        const deleted = await deleteFileFromS3(check.s3, fileId);

        if (!deleted) {
            logger.error('Error deleting file', { label: NAMESPACE });
            res.status(500).json({ message: 'Error deleting file'});
        } else {
            logger.info('File deleted successfully.', { label: NAMESPACE });
            res.status(200).json({ message: 'File deleted successfully', deleted });
        }
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error deleting file - ${errorMessage}`, { label: NAMESPACE });
        res.status(500).json({ message: `Error deleting file - ${errorMessage}` });
    }
};

const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Download file process started.', { label: NAMESPACE });

        const fileId = req.params.id;
        const check = await checkBucket();
        if (check.response !== 200) {
            logger.error('Error deleting file, bucket do not exist', { label: NAMESPACE });
            res.status(500).json({ message: 'Error deleting file, Error bucket do not exist' });
        }

        const fileFromS3 = await getFileFromS3(check.s3, fileId);

        if (!fileFromS3) {
            logger.error('Error getting file.', { label: NAMESPACE });
            res.status(500).json({ message: 'Error getting file'});
        } else {
            logger.info('File downloaded successfully.', { label: NAMESPACE });

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
        const errorMessage = getErrorMessage(err);
        logger.error(`Error getting file. ${ errorMessage }`, { label: NAMESPACE });
        res.status(500).json({ message: `Error getting file. ${ errorMessage }` });
    }
};

const replaceFile = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        logger.info('Replace file process started.', { label: NAMESPACE });

        const projectId = req.params.id;        
        const fileId = req.query.fileId;
        const assetId = req.query.assetId.toString();
        const sessionToken = req.headers['authorization'];

        if (projectId === undefined || projectId === null || projectId === '') {
            logger.error(`Project to replace file is required.`, { label: NAMESPACE });
            return res.status(400).json({ message: 'Project to replace file is required' });
        }

        if (fileId === undefined || fileId === null || fileId === '') {
            logger.error(`File to replace is required.`, { label: NAMESPACE });
            return res.status(400).json({ message: 'File to replace is required' });
        }

        if (assetId === undefined || assetId === null || assetId === '') {
            logger.error(`Asset to replace is required.`, { label: NAMESPACE });
            return res.status(400).json({ message: 'Asset to replace is required' });
        }
    
        if (!req.files || req.files.length === 0) {
            logger.error(`No files uploaded.`, { label: NAMESPACE });
            return res.status(400).json({ message: 'No files uploaded.' });
        }
    
        const check = await checkBucket();
        if (check.response !== 200) {
            logger.error('Error uploading files, bucket do not exist',{ label: NAMESPACE } );
            res.status(500).json({ message: 'Error uploading files, bucket do not exist' });
        }
    
        const files = req.files as Express.Multer.File[];
    
        const filesCreated = await replaceFilesInS3(check.s3, files[0], fileId.toString(), sessionToken, projectId, assetId);
    
        logger.info('Files replaced successfully.', { label: NAMESPACE });
        res.status(200).json({ message: 'Files replaced successfully', files: filesCreated });
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error uploading files. ${ errorMessage }`, { label: NAMESPACE });
        res.status(500).json({ message: `Error uploading files. ${ errorMessage }`});
    }
};

export default { filesUpload, deleteFile, downloadFile, replaceFile };