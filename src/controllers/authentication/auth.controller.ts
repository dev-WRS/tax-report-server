import { Request, Response } from 'express';

import { getErrorMessage } from '../../utils/error.utils';
import * as userServices from '../../services/auth.service';
import {UserLogin, UserResetPassword, UserToRegister} from '../../interfaces/user.interface';
import logging from '../../config/logging';

const NAMESPACE = 'Auth Controller';

const login = async (req: Request, res: Response) => {
    try {
        const userToLogin: UserLogin = req.body;
        const foundUser = await userServices.login(userToLogin);        
        res.status(200).json(foundUser).end(); 
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(NAMESPACE, `Error occurred while logging in user: ${errorMessage}`);
        return res.status(400).send({ message: errorMessage });
    }
};

const register = async (req: Request, res: Response) => {
    try {
        const userToRegister: UserToRegister = req.body;      
        const createdUser = await userServices.register(userToRegister);
        res.status(200).send({ user: createdUser });
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(NAMESPACE, `Error occurred while registering user: ${errorMessage}`);
        return res.status(400).send({ message: errorMessage });
    }
};

const resetPassword = async (req: Request, res: Response) => {
    try {
        const sessionToken = req.headers['authorization'];
        if (!sessionToken) {
          return res.status(403).send('Please authenticate');
        }
        
        const userToReset: UserResetPassword = req.body;
        const result = await userServices.resetPassword(userToReset);
            
        res.status(200).json(result).end(); 
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(NAMESPACE, `Error occurred while resetting password to user: ${errorMessage}`);
        return res.status(400).send({ message: errorMessage });
    }
}

const newPassword = async (req: Request, res: Response) => {
    try {        
        const password: string = req.body.password;
        const resetToken = req.headers.reset as string;

        const result = await userServices.newPassword(resetToken, password);
            
        res.status(200).json(result).end(); 
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(NAMESPACE, `Error occurred while recovering new password to user: ${errorMessage}`);
        return res.status(400).send({ message: errorMessage });
    }
}

const forgotPassword = async (req: Request, res: Response) => {
    try {        
        const email: string = req.body.email;
        const result = await userServices.forgotPassword(email);
            
        res.status(200).json(result).end();
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(NAMESPACE, `Error occurred while resetting password to user: ${errorMessage}`);
        return res.status(400).send({ message: errorMessage });
    }
}

export default { login, register, resetPassword, forgotPassword, newPassword };