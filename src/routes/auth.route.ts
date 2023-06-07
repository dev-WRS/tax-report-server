import express from 'express';

import authController from '../controllers/authentication/auth.controller';

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/isLoggedIn', authController.isLoggedIn);
authRouter.get('/logout', authController.logout);

export default authRouter;