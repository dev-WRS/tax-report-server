import { Request, Response, NextFunction } from 'express';

import * as projectServices from '@services/project.service';
import * as assetServices from '@services/assets.service';
import { getErrorMessage } from '@utils/error.utils';
import { logger } from '@config/logging';

const NAMESPACE = 'Project Controller';

const getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Get Projects process start', { label: NAMESPACE });

        const projects = await projectServices.getProjectsService();
        res.status(200).json(projects);
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error getting Projects. ${errorMessage}`, { label: NAMESPACE });
        res.status(500).json({ message: `Error getting Projects: ${errorMessage}` });
    }
};

const getProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Get Project', { label: NAMESPACE });

        const projectId = req.params.id;  
        const project = await projectServices.getProjectService(projectId);

        res.status(200).json(project);
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error getting Projects. ${errorMessage}`, { label: NAMESPACE });
        res.status(500).json({ message: `Error getting Projects: ${errorMessage}` });
    }
};

const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Create Project', { label: NAMESPACE });

        const projectToCreate = req.body;
        const project = await projectServices.createProjectService(projectToCreate);
        res.status(200).json({ project: project });
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error creating Project. ${errorMessage}`, { label: NAMESPACE });
        res.status(500).json({ message: `Error creating Project ${errorMessage}`});
    }
};

const createFileProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Create File Project', { label: NAMESPACE });

        const fileProjectToCreate = req.body;
        const file = await projectServices.createProjectInputFileService(fileProjectToCreate);
        res.status(200).json({ file: file });
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error creating File Project: ${errorMessage}`, { label: NAMESPACE});
        res.status(500).json({ message: `Error creating File Project: ${errorMessage}` });
    }
};

const updateAssetProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Update Asset Project', { label: NAMESPACE });

        const projectId = req.params.id; 
        const assetId = req.params.assetId; 
        const projectName = req.body.name;
        const projectDescription = req.body.projectDescription;
        const AssetToCreate = req.body;
        const asset = await assetServices.updateAssetService(assetId, projectId, false, AssetToCreate, projectName,
                                                             projectDescription);
        res.status(200).json({ asset: asset });
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error updating Project asset: ${errorMessage}`, { label: NAMESPACE });
        res.status(500).json({ message: `Error updating Project asset ${errorMessage}` });
    }
};

const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id;  
        logger.info('Delete Project', { label: NAMESPACE });
        const result = await projectServices.deleteProjectService(projectId);
        res.status(200).json({ result });
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error deleting Project: ${errorMessage}`, { label: NAMESPACE });
        res.status(500).json({ message: `Error deleting Project: ${errorMessage}` });
    }
}

export default { getProjects, getProject, createProject ,createFileProject, updateAssetProject, deleteProject };