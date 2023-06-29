import { Request, Response, NextFunction } from 'express';
import * as projectServices from '../../services/project.service';
import * as assetServices from '../../services/assets.service';

import logging from '../../config/logging';

const NAMESPACE = 'Project Controller';

const getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info('Get Projects', { label: NAMESPACE });
        const projects = await projectServices.getProjectsService();
        res.status(200).json(projects);
    } catch (err: any) {
        logging.error('Error getting Projects.', { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error getting Projects', error: err });
    }
};

const getProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id;  
        logging.info('Get Project', { label: NAMESPACE });
        const project = await projectServices.getProjectService(projectId);
        console.log(project);
        res.status(200).json(project);
    } catch (err: any) {
        logging.error('Error getting Projects.', { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error getting Projects', error: err });
    }
};

const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info('Create Project', { label: NAMESPACE });
        const projectToCreate = req.body;
        const project = await projectServices.createProjectService(projectToCreate);
        res.status(200).json({ project: project });
    } catch (err: any) {
        logging.error('Error creating Project.', { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error creating Project', error: err });
    }
};

const createFileProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info('Create File Project', { label: NAMESPACE });
        const fileProjectToCreate = req.body;
        const file = await projectServices.createProjectInputFileService(fileProjectToCreate);
        res.status(200).json({ file: file });
    } catch (err: any) {
        logging.error('Error creating File Project.', { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error creating File Project', error: err });
    }
};

const updateAssetProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id; 
        const assetId = req.params.assetId; 
        const projectName = req.body.name;
        const projectDescription = req.body.projectDescription;
        logging.info('Update Asset Project', { label: NAMESPACE });
        const AssetToCreate = req.body;
        const asset = await assetServices.updateAssetService(assetId, projectId, false, AssetToCreate, projectName, projectDescription);
        res.status(200).json({ asset: asset });
    } catch (err: any) {
        logging.error('Error updating Project asset.', { label: NAMESPACE, message: err.message });
        res.status(500).json({ message: 'Error Error updating Project asset', error: err });
    }
};

export default { getProjects, getProject, createProject ,createFileProject, updateAssetProject };