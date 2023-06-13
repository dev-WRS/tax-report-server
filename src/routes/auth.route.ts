import express from 'express';

import authController from '../controllers/authentication/auth.controller';
import { jwtAuthenticated } from '../middleware/auth.middleware';

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', jwtAuthenticated ,authController.logout);
authRouter.post('/reset-password', jwtAuthenticated ,authController.resetPassword);

export default authRouter;