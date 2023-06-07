import express from 'express';

import AuthController from '../controllers/authentication/auth.controller';

const authController = new AuthController();

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/change-password', authController.changePassword);

export default authRouter;