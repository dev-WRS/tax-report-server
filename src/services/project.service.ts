import { LeanDocument } from 'mongoose';
import { I_ProjectFileCreate, I_ProjectToCreate, validateProjectFileToCreate,
         validateProjectToCreate } from '@interfaces/project.interface';
import { I_ProjectDocument, createProject, ProjectModel, getProjectByName } from '@models/project/project.model';
import { I_ProjectFileDocument, ProjectFile, createProjectFile, getProjectFileByName } from '@models/project/project-file.model';
import { Asset } from '@models/project/assets.model';
import { checkBucket, deleteFileFromS3 } from './filesHandler.service';

export async function getProjectsService(): Promise<I_ProjectDocument[]> {
    try {
        const projects = await ProjectModel.find().populate('inputFile').populate('outputFile').populate('projectAssets').exec();
        return projects;
    } catch (error) {
        throw error;
    }
}

export async function getProjectService(projectId: string): Promise<I_ProjectDocument> {
    try {
        const project = await ProjectModel.findById(projectId).populate('inputFile').populate('outputFile').populate('projectAssets').exec();
        return project;
    } catch (error) {
        throw error;
    }
}

export async function createProjectService(projectToCreate: I_ProjectToCreate): Promise<LeanDocument<I_ProjectDocument>> {
    try {
        const errors = validateProjectToCreate(projectToCreate);
        if (!errors) {
            throw new Error('Validation error');
        }

        const existProject = await getProjectByName(projectToCreate.name);
        if (existProject) {
            throw new Error('Already exist a project with this name');
        }

        const newProject = await createProject( {
            name: projectToCreate.name,
            description: projectToCreate.description,
            status: projectToCreate.status,
            inputFile: projectToCreate.inputFile,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: projectToCreate.createdBy,
            projectAssets: projectToCreate.projectAssets,
        });

        return newProject;
    } catch (error) {
        throw error;
    }
}

export async function createProjectInputFileService(fileCreate: I_ProjectFileCreate): Promise<LeanDocument<I_ProjectFileDocument>> {
    try {
        const errors = validateProjectFileToCreate(fileCreate);
        if (!errors) {
            throw new Error('Validation error');
        }
    
        const existFileByName = await getProjectFileByName(fileCreate.name);
        const existFileByUrl = await getProjectFileByName(fileCreate.url);
    
        if (existFileByName && existFileByUrl) {
            throw new Error('Already exist a file with this name and url');
        }
    
        const newFile = await createProjectFile({
            name: fileCreate.name,
            size: fileCreate.size,
            type: fileCreate.type,
            url: fileCreate.url,
        });
    
        return newFile;
    } catch (error) {
        throw error;
    }
}

export async function deleteProjectService(projectId: string): Promise<boolean> {
    try {
        const projectToDelete = await ProjectModel.findById(projectId);
        if (!projectToDelete) {
            throw new Error('Project not found');
        }

        const assetToDelete = await Asset.findById(projectToDelete.projectAssets);
        if (!assetToDelete) {
            throw new Error('Asset not found');
        }

        const fileToDelete = await ProjectFile.findById(projectToDelete.inputFile);
        if (!fileToDelete) {
            throw new Error('File not found');
        }

        const check = await checkBucket();
        if (check.response !== 200) {
            throw new Error( 'Error deleting file in Bucket');
        }

        await deleteFileFromS3(check.s3, projectToDelete.inputFile.toString());

        await Asset.findByIdAndDelete(projectToDelete.projectAssets);

        await ProjectModel.findByIdAndDelete(projectId);

        return true
    } catch (error) {
        throw error;
    }
}