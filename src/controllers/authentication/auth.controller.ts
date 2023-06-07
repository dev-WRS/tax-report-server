import { Request, Response } from 'express';

import { getErrorMessage } from '../../utils/error.utils';
import * as userServices from '../../services/auth.service';
import {UserLogin, UserToRegister} from '../../interfaces/user.interface';
import logging from '../../config/logging';

const NAMESPACE = 'Auth Controller';

const login = async (req: Request, res: Response) => {
    try {
        const userToLogin: UserLogin = req.body;
        const foundUser = await userServices.login(userToLogin);

        res.cookie('WRS-AUTH', foundUser.token, { domain: 'localhost', path: '/' });
        
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

const isLoggedIn = async (req: Request, res: Response) => {
    try {
    const sessionToken = req.cookies['WRS-AUTH'];
    if (!sessionToken) {
      return res.status(403).send('Please authenticate');
    }

    const result = await userServices.isLoggedIn(sessionToken);
    
    res.cookie('WRS-AUTH', '', { domain: 'localhost', path: '/' });
        
    res.status(200).json(result).end(); 
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(NAMESPACE, `Error occurred while checking if user is logged in: ${errorMessage}`);
        return res.status(400).send({ message: errorMessage });
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        const sessionToken = req.cookies['WRS-AUTH'];
        if (!sessionToken) {
          return res.status(403).send('Please authenticate');
        }

        const result = await userServices.logout(sessionToken);
    
        res.cookie('WRS-AUTH', '', { domain: 'localhost', path: '/' });
            
        res.status(200).json(result).end(); 
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(NAMESPACE, `Error occurred while logging out user: ${errorMessage}`);
        return res.status(400).send({ message: errorMessage });
    }
}

export default { login, register, logout, isLoggedIn };