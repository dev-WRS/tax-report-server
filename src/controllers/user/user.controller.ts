import { Request, Response, NextFunction } from 'express';

import { getErrorMessage } from '@utils/error.utils';
import *  as userServices from '@services/user.service';
import { logger } from '@config/logging';

const NAMESPACE = 'User Controller';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Get Users process start', { label: NAMESPACE });

        const users = await userServices.getUsersService();
        res.status(200).json(users);
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error getting Users. ${errorMessage}`, { label: NAMESPACE });
        res.status(500).json({ message: `Error getting Users: ${errorMessage}` });
    }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Get User', { label: NAMESPACE });

        const userId = req.params.id;  
        const user = await userServices.getUserService(userId);

        res.status(200).json(user);
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error getting User. ${errorMessage}`, { label: NAMESPACE });
        res.status(500).json({ message: `Error getting User: ${errorMessage}` });
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Update User', { label: NAMESPACE });

        const userId = req.params.id; 
        const UserToUpdate = req.body;

        const user = await userServices.updateUserService(userId, UserToUpdate);
        res.status(200).json({ user: user });
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error updating User asset: ${errorMessage}`, { label: NAMESPACE });
        res.status(500).json({ message: `Error updating User ${errorMessage}` });
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;  
        logger.info('Delete User', { label: NAMESPACE });
        const result = await userServices.deleteUserService(userId);
        res.status(200).json({ result });
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        logger.error(`Error deleting User: ${errorMessage}`, { label: NAMESPACE });
        res.status(500).json({ message: `Error deleting User: ${errorMessage}` });
    }
}

export default { getUsers, getUser, updateUser, deleteUser}