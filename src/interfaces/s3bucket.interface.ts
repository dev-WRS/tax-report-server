export interface S3File {
    name: string;
    size: number;
    type: string;
    extension: string;
    content: ArrayBuffer;
}

export interface S3UploadedFile {
    name: string;
    size: number;
    type: string;
    extension: string;
    path: string;
}

export function validateS3File(fileToCreate: S3File): boolean {
    return fileToCreate.name !== undefined && fileToCreate.name !== '' &&
           fileToCreate.size !== undefined &&
           fileToCreate.type !== undefined && fileToCreate.type !== '' &&
           fileToCreate.content !== undefined &&
           fileToCreate.extension !== undefined && fileToCreate.extension !== '';
}

export function validateS3UploadedFile(fileCreated: S3UploadedFile): boolean {
    return fileCreated.name !== undefined && fileCreated.name !== '' &&
           fileCreated.size !== undefined &&
           fileCreated.type !== undefined && fileCreated.type !== '' &&
           fileCreated.path !== undefined && fileCreated.path !== '' &&
           fileCreated.extension !== undefined && fileCreated.extension !== '';
}