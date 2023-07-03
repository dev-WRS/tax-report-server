import express from 'express';

import userController from '@controllers/user/user.controller';
import { jwtAuthenticated } from '@middleware/auth.middleware';
import { checkRoleAuthorize } from '@middleware/admin.auth.middleware';

const userRouter = express.Router();

userRouter.get('/', jwtAuthenticated, userController.getUsers);
userRouter.get('/:id', jwtAuthenticated, checkRoleAuthorize, userController.getUser);
userRouter.put('/:id', jwtAuthenticated, checkRoleAuthorize, userController.updateUser);
userRouter.delete('/:id', jwtAuthenticated, checkRoleAuthorize, userController.deleteUser);

export default userRouter;