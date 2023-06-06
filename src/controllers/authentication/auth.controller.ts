import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import logging from '../../config/logging';
import { getErrorMessage } from '../../utils/error.utils';
import * as userServices from '../../services/auth.service';

const NAMESPACE = 'Auth Controller';

export const login = async (req: Request, res: Response) => {
    try {
        const foundUser = await userServices.login(req.body);
        res.status(200).send({user: {email: foundUser.user.email, name: foundUser.user.name, role: foundUser.user.role, token: foundUser.token }}); 
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(NAMESPACE, `Error occurred while logging in user: ${errorMessage}`);
        return res.status(500).send({ message: errorMessage });
    }
};

const register = async (req: Request, res: Response) => {
    try {
        const  errors = validationResult(req.body);

        if (!errors.isEmpty()) {
            return res.status(500).send({ message: 'Validation Errors' });
        }
        
        const createdUser = await userServices.register(req.body);
        res.status(200).send({ user: createdUser });
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        logging.error(NAMESPACE, `Error occurred while registering user: ${errorMessage}`);
        return res.status(500).send({ message: errorMessage });
    }
};

export default { login, register };