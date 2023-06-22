import express from 'express';

import projectController from '../controllers/project/project.controller';

const projectRouter = express.Router();
import { jwtAuthenticated } from '../middleware/auth.middleware';

projectRouter.get('/', jwtAuthenticated, projectController.getProjects);
projectRouter.post('/create', jwtAuthenticated, projectController.createProject);
projectRouter.post('/create-file', jwtAuthenticated, projectController.createFileProject);

export default projectRouter;