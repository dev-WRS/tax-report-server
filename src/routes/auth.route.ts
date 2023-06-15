import express from 'express';

import authController from '../controllers/authentication/auth.controller';
import { jwtAuthenticated } from '../middleware/auth.middleware';
import { checkRoleAuthorize } from '../middleware/admin.auth.middleware';

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/new-password', authController.newPassword);
// authRouter.post('/logout', [jwtAuthenticated, checkRoleAuthorize] ,authController.logout);
authRouter.post('/reset-password', jwtAuthenticated ,authController.resetPassword);
authRouter.post('/confirm-registry', authController.confirmRegister);

export default authRouter;