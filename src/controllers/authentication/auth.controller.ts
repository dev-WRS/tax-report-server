import { Request, Response } from 'express';

import { getErrorMessage } from '@utils/error.utils';
import * as userServices from '@services/auth.service';
import { UserLogin, UserResetPassword, UserToRegister } from '@interfaces/user.interface';
import logging from '@config/logging';

const NAMESPACE = 'Auth Controller';

const login = async (req: Request, res: Response) => {
    try {
        logging.info('Login process started.', { label: NAMESPACE });

        const userToLogin: UserLogin = req.body;
        const foundUser = await userServices.login(userToLogin);        
        res.status(200).json(foundUser).end(); 
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(`Error occurred while logging in user - ${errorMessage}`, { label: NAMESPACE });
        return res.status(400).send({ message: `Error occurred while logging in user - ${errorMessage}` });
    }
};

const register = async (req: Request, res: Response) => {
    try {
        logging.info('Register process started.', { label: NAMESPACE });

        const userToRegister: UserToRegister = req.body;      
        const createdUser = await userServices.register(userToRegister);
        res.status(200).send({ user: createdUser });
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(`Error occurred while registering user - ${errorMessage}`, { label: NAMESPACE });
        return res.status(400).send({ message: `Error occurred while registering user - ${errorMessage}` });
    }
};

const resetPassword = async (req: Request, res: Response) => {
    try {
        logging.info('Reset password process started.', { label: NAMESPACE });

        const sessionToken = req.headers['authorization'];
        if (!sessionToken) {
          return res.status(403).send({message: 'Please authenticate'});
        }
        
        const userToReset: UserResetPassword = req.body;
        const result = await userServices.resetPassword(userToReset);
            
        res.status(200).json(result).end(); 
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(`Error occurred while resetting password to user - ${errorMessage}`, { label: NAMESPACE });
        return res.status(400).send({ message: `Error occurred while resetting password to user - ${errorMessage}` });
    }
}

const newPassword = async (req: Request, res: Response) => {
    try {
        
        logging.info('Password change process started.');
        const password: string = req.body.password;
        const resetToken = req.headers.reset as string;

        const result = await userServices.newPassword(resetToken, password);
            
        res.status(200).json(result).end(); 
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(`Error occurred while recovering new password to user - ${errorMessage}`, { label: NAMESPACE });
        return res.status(400).send({ message: `Error occurred while recovering new password to user - ${errorMessage}` });
    }
}

const forgotPassword = async (req: Request, res: Response) => {
    try {
        logging.info('Password change process started.', { label: NAMESPACE });

        const email: string = req.body.email;
        const result = await userServices.forgotPassword(email);
           
        logging.info('Password changed successfully.', { label: NAMESPACE });
        res.status(200).json(result).end();
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(`Error occurred while resetting password to user - ${errorMessage}`, { label: NAMESPACE });
        return res.status(400).send({ message: `Error occurred while resetting password to user - ${errorMessage}` });
    }
}

const confirmRegister = async (req: Request, res: Response) => {
    try {
        logging.info('Confirm registry process started.', { label: NAMESPACE });

        const confirmToken = req.headers['confirm-token'] as string;

        const result = await userServices.confirmRegistry(confirmToken);
        
        logging.info('Confirm registry successfully.', { label: NAMESPACE });
        res.status(200).json(result).end(); 
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(`Error occurred at confirm registry - ${errorMessage}`, { label: NAMESPACE });
        return res.status(400).send({ message: `Error occurred at confirm registry - ${errorMessage}` });
    }
}

export default { login, register, resetPassword, forgotPassword, newPassword, confirmRegister };