import express from 'express';

import projectController from '@controllers/project/project.controller';
import { jwtAuthenticated } from '@middleware/auth.middleware';
import { checkRoleAuthorize } from '@middleware/admin.auth.middleware';

const projectRouter = express.Router();

projectRouter.get('/', jwtAuthenticated, projectController.getProjects);
projectRouter.get('/:id', jwtAuthenticated, checkRoleAuthorize, projectController.getProject);
projectRouter.post('/create', jwtAuthenticated, checkRoleAuthorize, projectController.createProject);
projectRouter.post('/create-file', jwtAuthenticated, checkRoleAuthorize, projectController.createFileProject);
projectRouter.put('/:id/asset/:assetId', jwtAuthenticated, checkRoleAuthorize, projectController.updateAssetProject);

export default projectRouter;