import { S3 } from "aws-sdk";
import { CreateBucketRequest } from 'aws-sdk/clients/s3';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Readable } from "nodemailer/lib/xoauth2";
import { LeanDocument } from "mongoose";

import config from '@config/config';
import { createProjectService, getProjectService } from "@services/project.service";
import { getValuesFromEncryptedConfig } from '@config/aws-bucket';
import { I_AssetToCreate, I_ProjectFileCreate } from '@interfaces/project.interface';
import { createProjectFile, deleteProjectFileById, getProjectFileById } from '@models/project/project-file.model';
import { I_ProjectDocument, ProjectStatus } from "@models/project/project.model";
import { getUserByEmail } from "@models/authentication/user.model";
import { createAssetService, updateAssetService } from "@services/assets.service";
import { ColumnsToShow } from "@models/project/assets.model";

export async function checkBucket (): Promise<{response: number, s3: S3}>  {
    try {
      let response = 403;
      const { clientId, clientSecret } = getValuesFromEncryptedConfig();
      const s3 = new S3({
          accessKeyId: clientId,
          secretAccessKey: clientSecret,
      });
      await s3.headBucket({Bucket: config.drive.bucketName}).promise().then((data) => {
        response = data.$response.httpResponse.statusCode;
      });  
      
      return {response, s3};
    } catch (error) {    
      throw new Error(error) 
    }
};

export async function createBucket (s3: S3) {

    const params: CreateBucketRequest = { Bucket: config.drive.bucketName,
      CreateBucketConfiguration: { LocationConstraint: "us-east-1" }
    };
  
    try {
      const res = await s3.createBucket(params).promise();
  
      console.log("Bucket Created Successful", res.Location);
  
      return {success: true, message: "Bucket Created Successful", data: res.Location};
    } catch (error) {
  
      return {success: false, message: "Unable to create bucket", data: error};
    }
};

async function uploadFileToS3(s3: S3, fileData: Express.Multer.File, sessionToken: string, projectIdToUpdate: string, assetIdToUpdate: string)
                              : Promise<{ file: I_ProjectFileCreate, project: LeanDocument<I_ProjectDocument> }> {
    try {
        const params = {
            Bucket: config.drive.bucketName,
            Key: fileData.originalname,
            Body: fileData.buffer
        };

        const uploadResult = await s3.upload(params).promise();
        const { Location: url } = uploadResult;

        const createdFile: I_ProjectFileCreate = {
            name: fileData.originalname,
            size: fileData.size,
            type: fileData.mimetype,
            url: url
        };

        const fileCreated = await createProjectFile(createdFile);        

        const validToken = jwt.verify(sessionToken.slice(7), config.secrets.jwtSecret) as JwtPayload;
        const foundUser = await getUserByEmail(validToken.email);

        if (projectIdToUpdate !== '' && assetIdToUpdate !== '') {
            let projectToUpdate = await getProjectService(projectIdToUpdate);

            if (!projectToUpdate) {
                throw new Error('Project not found');
            }
            
            await updateAssetService(assetIdToUpdate, '', true);

            projectToUpdate.inputFile = fileCreated._id;
            projectToUpdate.updatedAt = new Date();
            projectToUpdate.createdBy = foundUser._id;
            projectToUpdate.status = ProjectStatus.STARTED;
            projectToUpdate = await projectToUpdate.save();

            return { file: fileCreated, project: projectToUpdate };
        } else {            
            const assetToCreate = await createAssetService(new I_AssetToCreate());

            const projectToCreate = {
                name: `${fileCreated.name} (Provisional)`,
                description: `Project created from file ${fileCreated.name} (Provisional)`,
                status: ProjectStatus.STARTED,
                inputFile: fileCreated._id,
                outputFile: '',
                createdBy: foundUser._id,
                projectAssets: assetToCreate._id,
                exitFileConfiguration: new ColumnsToShow()
            };

            const projectCreated = await createProjectService(projectToCreate);
            return { file: fileCreated, project: projectCreated };
        }
    } catch (error) {
        if (error.message.includes('E11000')) {
            throw new Error('File already exists in the bucket with the same name');
        }
        throw new Error('File could not be uploaded to the bucket');
    }
}

export async function uploadFilesToS3 (s3: S3, filesData: Express.Multer.File[], sessionToken: string)
                      : Promise<{file: I_ProjectFileCreate, project: LeanDocument<I_ProjectDocument>}[]> {
    try {
        const filesUploaded: {file: I_ProjectFileCreate, project: LeanDocument<I_ProjectDocument>}[] = [];
        for (const file of filesData!) {
            const fileUploaded = await uploadFileToS3(s3, file, sessionToken, '','');
            filesUploaded.push(fileUploaded);
        }
        return filesUploaded;
    }
    catch (error) {
      throw new Error('Files can not be uploaded to bucket');
    }
}

export async function deleteFileFromS3(s3: S3, fileId: string): Promise<boolean> {
  try {
      const fileDeleted = await getProjectFileById(fileId);

      if (!fileDeleted) {
          throw new Error('File cannot be deleted from bucket');
      }

      const params = {
          Bucket: config.drive.bucketName,
          Key: fileDeleted.name,
      };

      await s3.deleteObject(params).promise();
      await deleteProjectFileById(fileDeleted._id);

      return true;
  } catch (error) {
      throw new Error('File cannot be deleted from bucket');
  }
}

export async function getFileFromS3(s3: S3, fileId: string): Promise<{ readable: Readable, fileName: string }> {
  try {
      const file = await getProjectFileById(fileId);

      if (!file) {
          throw new Error('File cannot be retrieved from bucket');
      }

      const params = {
          Bucket: config.drive.bucketName,
          Key: file.name,
      };

      try {
          const getObjectResponse = await s3.getObject(params).promise();
          const fileData = getObjectResponse.Body as Readable;
          return { readable: fileData, fileName: file.name };
      } catch (error) {
          throw error;
      }
  } catch (error) {
      throw new Error('File cannot be retrieved from bucket');
  }
}

export async function replaceFilesInS3(s3: S3, filesData: Express.Multer.File, fileId: string, sessionToken: string,
                      projectIdToUpdate: string, assetIdToUpdate: string)
                      : Promise<{file: I_ProjectFileCreate, project: LeanDocument<I_ProjectDocument>}> {
    try {
        const fileUploaded = await uploadFileToS3(s3, filesData, sessionToken, projectIdToUpdate, assetIdToUpdate);

        await deleteFileFromS3(s3, fileId);
        return fileUploaded;
    }
    catch (error) {
      throw new Error('Files can not be replaced in bucket');
    }
}

